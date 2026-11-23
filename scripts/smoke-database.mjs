import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { serverFnFetcher } from '../node_modules/@tanstack/start-client-core/dist/esm/client-rpc/serverFnFetcher.js';
import { runWithStartContext } from '../node_modules/@tanstack/start-storage-context/dist/esm/index.js';
import server from '../dist/server/server.js';
import { catalogData } from './catalog-data.mjs';
const db = new PGlite();
const originalFetch = globalThis.fetch;
const admin = '11111111-1111-4111-8111-111111111111';
const origin = 'https://logisticsworld.eu';
let cookie = '', setCookie = '', networkCalls = 0, claims = admin, failSitemap = false;
const catalog = await catalogData();
const company = catalog.find(company=>company.id==='si-mediasped');
const functions = {};
for (const file of fs.readdirSync('dist/server/assets').filter(file=>file.endsWith('.js'))) {
  const code=fs.readFileSync('dist/server/assets/'+file,'utf8');
  for (const match of code.matchAll(/const (\w+)_createServerFn_handler = createServerRpc\(\{\s*id: "([^"]+)"/g)) functions[match[1]]=match[2];
}
const call = async (name,data,method='POST',requestOrigin=origin) => {
  assert.ok(functions[name], `Compiled server function ${name} is discoverable`);
  const response = await runWithStartContext({startOptions:{}}, () => serverFnFetcher(origin+'/_serverFn/'+functions[name],[{method,data,headers:{origin:requestOrigin,...(cookie?{cookie}:{})}}],async(url,init)=> {
    const response=await server.fetch(new Request(url,init));
    if (response.headers.has('set-cookie')) {
      setCookie=response.headers.get('set-cookie'); cookie=setCookie.split(';')[0];
    }
    return response;
  }));
  if(response?.error) throw response.error;
  return response?.result ?? response;
};
const page=async path => {
  let url=new URL(path,origin),response;
  for(let hops=0;hops<5;hops++) {
    response=await server.fetch(new Request(url,{headers:cookie?{cookie}:{}}));
    const location=response.headers.get('location');
    if(![301,302,303,307,308].includes(response.status)||!location)break;
    await response.text();url=new URL(location,url);assert.equal(url.origin,origin);
  }
  return {response,html:await response.text()};
};
try {
  await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public,auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
    alter default privileges in schema public grant execute on functions to anon,authenticated;`);
  for (const file of fs.readdirSync('supabase/migrations').sort()) await db.exec(fs.readFileSync('supabase/migrations/'+file,'utf8'));
  await db.exec(fs.readFileSync('supabase/seed.sql','utf8'));
  await db.query('insert into auth.users(id) values($1)',[admin]);
  await db.query("insert into public.admin_memberships values($1,'administrator',true)",[admin]);
  process.env.CATALOG_SUPABASE_URL='https://catalog.supabase.co'; process.env.CATALOG_SUPABASE_PUBLISHABLE_KEY='sb_publishable_test';
  process.env.PUBLIC_INDEXING_ENABLED='true';
  globalThis.fetch=async (input,init={}) => {
    const url=new URL(typeof input==='string'?input:input.url);
    assert.equal(url.origin,'https://catalog.supabase.co','All service requests stay on the test database origin');
    networkCalls++;
    if(failSitemap && url.pathname==='/rest/v1/company_publications' && !url.searchParams.has('slug')) return Response.json({code:'unavailable'},{status:503});
    const token=new Headers(init.headers).get('authorization');
    if(url.pathname==='/auth/v1/token') { assert.equal(init.method,'POST'); assert.ok(JSON.parse(init.body).password); return Response.json({access_token:'test-admin-token',expires_in:3600}); }
    if(url.pathname==='/auth/v1/user') return token==='Bearer test-admin-token' ? Response.json({id:claims,email:'admin@example.test'}) : Response.json({}, {status:401});
    if(url.pathname==='/auth/v1/logout') return Response.json({});
    // PGlite is a single database connection. Serialize remote HTTP queries because
    // the application may request its public root data and child route in parallel.
    return new Promise((resolve,reject)=> {
      queue=queue.then(async()=> {
        const role=token==='Bearer test-admin-token'?'authenticated':'anon';
        await db.exec(`set role ${role}`);
        await db.query("select set_config('request.jwt.claim.sub',$1,false)",[role==='authenticated'?claims:'']);
        try {
          let result;
          if(url.pathname==='/rest/v1/admin_memberships') result=(await db.query('select role from public.admin_memberships where active and user_id=$1',[claims])).rows;
          else if(url.pathname==='/rest/v1/company_publications') {
            if(url.searchParams.get('slug')) result=(await db.query('select payload from public.company_publications where slug=$1 limit 1',[url.searchParams.get('slug').slice(3)])).rows;
            else result=(await db.query("select slug,published_at,payload->'services' as services,payload->'offices' as offices from public.company_publications order by slug limit 1000 offset $1",[Number(url.searchParams.get('offset')||0)])).rows;
          }
          else {
            const name=url.pathname.split('/').pop(); assert.equal(init.method,'POST','Database RPC preserves its method after bundling'); const args=JSON.parse(init.body);
            const calls={
              search_companies:['select public.search_companies($1) result',[args.p_search]],
              admin_catalog:['select public.admin_catalog() result',[]],
              save_company:['select public.save_company($1,$2,$3) result',[args.p_draft,args.p_expected_version,args.p_publish]],
              archive_company:['select public.archive_company($1,$2) result',[args.p_id,args.p_expected_version]],
              submit_company:['select public.submit_company($1,$2,$3,$4,$5) result',[args.p_id,args.p_company,args.p_website,args.p_email,args.p_consent]],
              submission_inbox:['select public.submission_inbox($1,$2) result',[args.p_status,args.p_page]],
              review_submission:['select public.review_submission($1,$2,$3,$4) result',[args.p_id,args.p_expected_version,args.p_status,args.p_note]],
            };
            assert.ok(calls[name],`Expected database RPC ${name}`);
            result=(await db.query(...calls[name])).rows[0].result;
          }
          resolve(Response.json(result??null));
        } catch(error) { resolve(Response.json({code:error.code},{status:error.code==='42501'?403:400})); }
        finally { await db.exec('reset role'); }
      }).catch(reject);
    });
  };
  let queue=Promise.resolve();
  let seoPage=await page('/');
  assert.ok(seoPage.html.includes('content="index, follow"'),'Production homepage permits indexing');
  assert.ok(!seoPage.html.includes('href="/?q='),'Empty default query parameters are stripped');
  assert.ok(!seoPage.html.includes('href="/?office='),'The logo and home links omit the market default');
  for(const path of ['/companies?q=Koper','/companies?city=Koper','/companies?page=2','/admin','/admin/submissions','/submit-company']) {
    const loaded=await page(path);assert.ok(loaded.html.includes('content="noindex, follow"'),path+' stays out of indexing');
  }
  const sitemap=await page('/sitemap.xml');
  assert.equal(sitemap.response.status,200);assert.ok(sitemap.response.headers.get('content-type').startsWith('application/xml'));
  const sitemapUrls=[...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
  assert.equal(sitemapUrls.length,45,'Sitemap contains only the curated public pages and published profiles');
  assert.ok(!sitemap.html.includes('/admin'));assert.ok(!sitemap.html.includes('/submit-company'));assert.ok(sitemapUrls.every(url=>!url.includes('?')));
  assert.equal(new Set(sitemapUrls).size,sitemapUrls.length,'Canonical sitemap URLs are unique');
  for(const url of sitemapUrls) { const loaded=await page(new URL(url).pathname);assert.equal(loaded.response.status,200,url);assert.ok(loaded.html.includes('content="index, follow"'),url+' is indexable'); }
  for(const path of ['/locations/koper','/services/customs/koper']) {
    const loaded=await page(path);
    assert.ok(loaded.html.includes('aria-label="Mediašped quotation enquiry"'),path+' shows the published partner beside the enquiry checklist');
  }
  const preview=await server.fetch(new Request('https://preview.example/sitemap.xml'));assert.equal(preview.status,404);
  const previewHome=await server.fetch(new Request('https://preview.example/'));assert.ok((await previewHome.text()).includes('content="noindex, follow"'));
  const robots=await page('/robots.txt');assert.ok(robots.html.includes('Sitemap: https://logisticsworld.eu/sitemap.xml'));
  const sitemapHead=await server.fetch(new Request(origin+'/sitemap.xml',{method:'HEAD'}));assert.equal(sitemapHead.status,200);assert.equal((await sitemapHead.text()).length,0);
  failSitemap=true;const unavailableMap=await page('/sitemap.xml');assert.equal(unavailableMap.response.status,503);assert.equal(unavailableMap.response.headers.get('cache-control'),'no-store');assert.ok(!unavailableMap.html.includes('<loc>'));failSitemap=false;
  let submissionPage=await page('/submit-company');
  assert.ok(submissionPage.html.includes('Submit for review'));
  assert.equal(submissionPage.response.headers.get('cache-control'),'private, no-store');
  await assert.rejects(()=>call('getSubmissionInbox',{status:'all',page:1},'GET'));
  const submission={requestId:'44444444-4444-4444-8444-444444444444',company:'Private test logistics',website:'https://example.test/',email:'private-contact@example.test',consent:true,contactFax:''};
  const receipt=await call('submitCompany',submission);
  assert.equal(receipt.reference,submission.requestId);
  assert.deepEqual(await call('submitCompany',submission),receipt,'Lost-response retry returns the same reference');
  assert.equal((await db.query('select count(*)::integer n from public.company_submissions')).rows[0].n,1);
  await assert.rejects(()=>call('submitCompany',{...submission,requestId:crypto.randomUUID()},'POST','https://other.test'));
  await assert.rejects(()=>call('submitCompany',{...submission,contactFax:'bot'}));
  submissionPage=await page('/companies');
  assert.ok(!submissionPage.html.includes(submission.email));
  let loaded=await page('/admin');
  assert.equal(loaded.response.status,200); assert.ok(loaded.html.includes('Sign in')); assert.ok(!loaded.html.includes('Save draft'));
  await assert.rejects(()=>call('getAdminCatalog',undefined,'GET'));
  await call('signIn',{email:'admin@example.test',password:'test-password'});
  assert.ok(/HttpOnly/i.test(setCookie)); assert.ok(/Secure/i.test(setCookie)); assert.ok(/SameSite=Strict/i.test(setCookie));
  loaded=await page('/admin'); assert.ok(loaded.html.includes('Company catalog</h1>')); assert.equal(loaded.response.headers.get('cache-control'),'private, no-store');
  loaded=await page('/admin/submissions'); assert.ok(loaded.html.includes(submission.email)); assert.equal(loaded.response.headers.get('cache-control'),'private, no-store');
  await call('reviewSubmission',{id:submission.requestId,expectedVersion:1,status:'reviewed',note:'Evidence checked privately.'});
  await assert.rejects(()=>call('reviewSubmission',{id:submission.requestId,expectedVersion:1,status:'rejected',note:'Stale review'}));
  assert.equal((await call('getSubmissionInbox',{status:'pending',page:1},'GET')).total,0);
  assert.equal((await db.query('select count(*)::integer n from public.company_publications')).rows[0].n,25,'Review cannot publish a company');
  const privateDraft={...company,summary:'A private test draft with enough text to pass factual summary validation.'};
  await call('saveCompany',{draft:privateDraft,expectedVersion:1,publish:false});
  loaded=await page('/companies/mediasped'); assert.ok(!loaded.html.includes(privateDraft.summary),'Draft is not server rendered publicly');
  await call('saveCompany',{draft:privateDraft,expectedVersion:2,publish:true});
  loaded=await page('/companies/mediasped'); assert.ok(loaded.html.includes(privateDraft.summary),'Published revision is server rendered');
  await assert.rejects(()=>call('saveCompany',{draft:privateDraft,expectedVersion:1,publish:false}));
  await assert.rejects(()=>call('saveCompany',{draft:privateDraft,expectedVersion:3,publish:false},'POST','https://other.test'));
  await call('archiveCompany',{id:company.id,expectedVersion:3});
  const archivedSitemap=await page('/sitemap.xml');assert.ok(!archivedSitemap.html.includes('<loc>https://logisticsworld.eu/companies/mediasped</loc>'),'Archival removes profiles from the live sitemap');
  loaded=await page('/companies/mediasped'); assert.equal(loaded.response.status,404);
  loaded=await page('/blog/shipping-through-koper'); assert.ok(!loaded.html.includes('Featured logistics partner: Mediašped'),'Archived partner is absent from blog promotions');
  for(const path of ['/locations/koper','/services/customs/koper']) {
    const loaded=await page(path);
    assert.ok(!loaded.html.includes('aria-label="Mediašped quotation enquiry"'),path+' hides the checklist promotion when the partner is archived');
  }
  loaded=await page('/'); assert.ok(!loaded.html.includes('href="/companies/mediasped"'),'Archived company is absent from homepage');
  loaded=await page('/companies/abc-logistika'); assert.ok(!loaded.html.includes('href="/companies/mediasped"'),'Archived company is absent from related listings');
  await db.query('update public.admin_memberships set active=false where user_id=$1',[admin]);
  loaded=await page('/admin'); assert.ok(!loaded.html.includes('Company catalog</h1>'),'Revoked membership cannot read the private catalog');
  await assert.rejects(()=>call('getAdminCatalog',undefined,'GET'));
  await assert.rejects(()=>call('getSubmissionInbox',{status:'all',page:1},'GET'));
  await call('signOut'); assert.ok(/Max-Age=0/i.test(setCookie));
  console.log(`PASS: built-server login, private drafts, publication, conflicts, CSRF, archival across public routes, revocation and logout (${networkCalls} emulated service requests).`);
} finally {
  globalThis.fetch=originalFetch; delete process.env.CATALOG_SUPABASE_URL; delete process.env.CATALOG_SUPABASE_PUBLISHABLE_KEY; delete process.env.PUBLIC_INDEXING_ENABLED; await db.close();
}
