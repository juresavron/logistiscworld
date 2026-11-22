import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { catalogData } from './catalog-data.mjs';
const db = new PGlite();
const catalog = await catalogData();
const admin = '11111111-1111-4111-8111-111111111111', editor = '22222222-2222-4222-8222-222222222222', outsider = '33333333-3333-4333-8333-333333333333';
let assertions = 0;
const check = (actual, expected, message) => { assert.deepEqual(actual, expected, message); assertions++; };
const asRole = async (role, user, callback) => {
  await db.exec(`set role ${role}`);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user ?? '']);
  try { return await callback(); }
  finally { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub','',false)"); }
};
const rpc = async (sql, args=[]) => (await db.query(sql,args)).rows[0]?.result;
const rejects = async (fn, code, message) => {
  await assert.rejects(fn, error => error.code === code, message); assertions++;
};
try {
  await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public,auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
    alter default privileges in schema public grant execute on functions to anon,authenticated;`);
  for (const file of fs.readdirSync('supabase/migrations').sort()) await db.exec(fs.readFileSync('supabase/migrations/'+file,'utf8'));
  await db.exec(fs.readFileSync('supabase/seed.sql','utf8'));
  await db.query('insert into auth.users(id) values($1),($2),($3)',[admin,editor,outsider]);
  await db.query("insert into public.admin_memberships values($1,'administrator',true),($2,'editor',true)",[admin,editor]);
  for (const signature of ['public.admin_catalog()', 'public.save_company(jsonb,integer,boolean)', 'public.archive_company(text,integer)']) {
    check((await db.query("select has_function_privilege('anon',$1,'execute') permitted",[signature])).rows[0].permitted,false,'Anonymous callers cannot execute '+signature);
  }
  await asRole('anon',null,async () => {
    const result = await rpc('select public.search_companies($1) result',[{}]);
    check(result.total,25,'All 25 launch listings are published');
    check(result.companies[0].id,'si-mediasped','Featured partner appears first');
    const named=await rpc('select public.search_companies($1) result',[{sort:'name'}]);
    assert.notEqual(named.companies[0].id,'si-mediasped'); assertions++;
    check((await rpc('select public.search_companies($1) result',[{q:'mediasped'}])).total,1,'Accent-insensitive search');
    check((await rpc('select public.search_companies($1) result',[{q:'zzzznonexistent',page:10000}])).page,1,'Empty results clamp pagination');
    check((await rpc('select public.search_companies($1) result',[{services:['rail']}])).total,catalog.filter(c=>c.services.includes('rail')).length,'Service filtering');
    check((await rpc('select public.search_companies($1) result',[{coverage:'HR',services:['road']}])).total,catalog.filter(c=>c.services.includes('road')&&c.coverage.some(v=>v.service==='road'&&v.countries.includes('HR'))).length,'Service-specific coverage');
    await rejects(()=>db.query('select * from public.company_drafts'),'42501','Drafts stay private');
    await rejects(()=>db.query('select * from public.company_revisions'),'42501','Revision history stays private');
    await rejects(()=>db.query('select public.admin_catalog()'),'42501','No anonymous admin RPC');
    await rejects(()=>db.query('insert into public.company_publications select * from public.company_publications limit 1'),'42501','No anonymous write');
  });
  await asRole('authenticated',outsider,async () => {
    check((await db.query('select * from public.admin_memberships')).rows.length,0,'Membership RLS');
    await rejects(()=>db.query('select public.admin_catalog()'),'42501','Authentication alone does not grant editor access');
  });
  const original = catalog.find(c=>c.id==='si-mediasped');
  const changed = {...original,summary:'An updated draft description held privately until an administrator publishes it.'};
  await asRole('authenticated',editor,async () => {
    const result=await rpc('select public.save_company($1,1,false) result',[changed]);
    check(result.version,2,'Editor can save a shared draft');
    check(result.published.summary,original.summary,'Draft cannot leak into public data');
    check((await db.query('select * from public.admin_memberships')).rows.length,1,'Only own membership visible');
    await rejects(()=>db.query('select public.save_company($1,2,true)',[changed]),'42501','Editor cannot publish');
    await rejects(()=>db.query('select public.save_company($1,2,false)',[{...changed,featured:false}]),'42501','Editor cannot change paid placement');
    await rejects(()=>db.query('select public.archive_company($1,2)',[original.id]),'42501','Editor cannot archive');
    await rejects(()=>db.query("update public.admin_memberships set role='administrator' where user_id=$1",[editor]),'42501','No privilege self-assignment');
    await rejects(()=>db.query('select public.save_company($1,1,false)',[changed]),'40001','Stale edits are rejected');
  });
  await asRole('authenticated',admin,async () => {
    const result=await rpc('select public.save_company($1,2,true) result',[changed]);
    check(result.version,3,'Administrator can publish atomically');
    check(result.published.summary,changed.summary,'Publication uses the approved revision');
    await rejects(()=>db.query('select public.save_company($1,3,true)',[{...changed,isSample:true}]),'22023','No fictional publication');
    await rejects(()=>db.query('select public.save_company($1,3,true)',[{...changed,sourceUrl:''}]),'22023','No unsourced publication');
    await rejects(()=>db.query('select public.save_company($1,3,true)',[{...changed,checkedAt:'2099-01-01'}]),'22023','No future review date');
    await rejects(()=>db.query('select public.save_company($1,3,true)',[{...changed,website:'javascript:alert(1)'}]),'22023','Unsafe contact protocol rejected in database');
    await rejects(()=>db.query('select public.save_company($1,0,true)',[{...changed,id:'duplicate-company'}]),'23505','Unique company slug');
    await db.query('select public.archive_company($1,3)',[original.id]);
    const entries=await rpc('select public.admin_catalog() result');
    check(entries.find(e=>e.draft.id===original.id).version,4,'Archive records a revision');
    check(entries.find(e=>e.draft.id===original.id).archived,true,'Archived state retained');
  });
  await asRole('anon',null,async () => {
    check((await db.query('select * from public.company_publications where id=$1',[original.id])).rows.length,0,'Archived profile is removed');
    check((await rpc('select public.search_companies($1) result',[{}])).total,24,'Archive removes company from directory');
  });
  await asRole('authenticated',admin,async () => { await db.query('select public.save_company($1,4,true)',[changed]); });
  await db.query('update public.admin_memberships set active=false where user_id=$1',[editor]);
  await asRole('authenticated',editor,async () => { await rejects(()=>db.query('select public.admin_catalog()'),'42501','Revoked membership applies to an existing session'); });
  check((await db.query('select count(*)::integer n from public.company_revisions where company_id=$1',[original.id])).rows[0].n,5,'Append-only revision history');
  const submissionId='44444444-4444-4444-8444-444444444444';
  const submit=(id=submissionId,email='contact@example.test')=>rpc('select public.submit_company($1,$2,$3,$4,true) result',[id,'Example Logistics','https://example.test/',email]);
  await asRole('anon',null,async()=> {
    check(await submit(),{reference:submissionId},'Anonymous submission returns a reference only');
    check(await submit(),{reference:submissionId},'Retry returns the original reference');
    await rejects(()=>submit(submissionId,'changed@example.test'),'22023','A used reference cannot overwrite contact data');
    await rejects(()=>db.query('select * from public.company_submissions'),'42501','Submitter email stays private');
    await rejects(()=>db.query('select public.submission_inbox($1,1)',['all']),'42501','Anonymous inbox access is denied');
    await rejects(()=>db.query('select public.review_submission($1,1,$2,$3)',[submissionId,'reviewed','forged']),'42501','Anonymous review is denied');
    await rejects(()=>db.query('select public.submit_company($1,$2,$3,$4,false)',[crypto.randomUUID(),'Example Logistics','https://example.test/','other@example.test']),'22023','Consent required at the database boundary');
    await rejects(()=>db.query('select public.submit_company($1,$2,$3,$4,true)',[crypto.randomUUID(),'Example Logistics','javascript:alert(1)','other@example.test']),'22023','Database validates direct RPC website input');
    await submit(crypto.randomUUID()); await submit(crypto.randomUUID());
    await rejects(()=>submit(crypto.randomUUID()),'54000','Per-email quota is enforced in the database');
    check(await submit(),{reference:submissionId},'Retries still work after the quota is reached');
  });
  await asRole('authenticated',outsider,async()=> {
    await rejects(()=>db.query('select public.submission_inbox($1,1)',['all']),'42501','An Auth account without membership cannot read submissions');
    await rejects(()=>db.query('select public.review_submission($1,1,$2,$3)',[submissionId,'reviewed','forged']),'42501','An outsider cannot review requests');
  });
  await asRole('authenticated',admin,async()=> {
    check((await rpc('select public.submission_inbox($1,1) result',['pending'])).total,3,'Reviewer receives the private queue');
    await db.query('select public.review_submission($1,1,$2,$3)',[submissionId,'reviewed','Checked official website; catalog publication is separate.']);
    await rejects(()=>db.query('select public.review_submission($1,1,$2,$3)',[submissionId,'rejected','stale']),'40001','Concurrent reviews cannot overwrite each other');
    check((await rpc('select public.submission_inbox($1,1) result',['pending'])).total,2,'Review status filters are database-backed');
    check((await rpc('select public.submission_inbox($1,10000) result',['reviewed'])).page,1,'Review pagination clamps to available pages');
    await rejects(()=>db.query('select * from catalog_private.submission_reviews'),'42501','Review audit cannot be changed through base access');
  });
  check((await db.query('select count(*)::integer n from catalog_private.submission_reviews')).rows[0].n,1,'Review action has an immutable audit entry');
  check((await db.query('select count(*)::integer n from public.company_publications')).rows[0].n,25,'Intake and review do not publish companies');
  await db.query("insert into public.company_submissions(id,company,website,email) select gen_random_uuid(),'Quota fixture','https://example.test/', 'fixture-'||g||'@example.test' from generate_series(1,97) g");
  await asRole('anon',null,async()=> { await rejects(()=>submit(crypto.randomUUID(),'fresh@example.test'),'54000','Global quota cannot be bypassed with new email addresses'); });
  console.log(`${assertions} PostgreSQL publication, search and access-control assertions passed.`);
} finally { await db.close(); }
