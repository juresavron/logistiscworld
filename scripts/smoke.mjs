import assert from 'node:assert/strict';
import server from '../dist/server/server.js';

const cases = [
  ['/', 200, 'Freight forwarders'],
  ['/?q=zzzznonexistent', 200, 'No companies match'],
  ['/?q=Koper', 200, 'Mediašped'],
  ['/?services=customs', 200, 'Customs clearance'],
  ['/?coverage=HR&type=Carrier', 200, 'Transport Starin'],
  ['/?capabilities=Refrigerated%20cargo', 200, 'No companies match'],
  ['/companies', 200, 'Mediašped'],
  ['/companies?office=SI', 200, 'in Slovenia.'],
  ['/companies?office=IT', 200, 'Mediašped'],
  ['/companies?coverage=HR', 200, 'Transport Starin'],
  ['/companies?q=zzzznonexistent', 200, 'No companies'],
  ['/companies/mediasped', 200, 'Mediašped'],
  ['/compare?company=sample-01,sample-02', 200, 'Freight forwarders'],
  ['/services', 200, 'Road transport'],
  ['/services/customs', 200, 'Customs clearance'],
  ['/services/sea', 200, 'Sea freight through Koper'],
  ['/services/forwarding', 200, 'International freight forwarding services in Slovenia'],
  ['/services/customs/koper', 200, 'Customs clearance in Koper'],
  ['/locations/koper', 200, 'Freight forwarders in Koper'],
  ['/locations/ljubljana', 200, 'Freight forwarders in Ljubljana'],
  ['/blog', 200, 'Notes for the journey'],
  ['/blog/shipping-through-koper', 200, 'Start with the final destination'],
  ['/blog/fcl-or-lcl-container-shipping', 200, 'Two ways to use a container'],
  ['/blog/freight-quote-checklist', 200, 'Use one checklist for every provider'],
  ['/blog/container-shipping-china-to-koper', 200, 'What should a China-to-Koper quotation include?'],
  ['/blog/missing-guide', 404, 'This guide isn’t here'],
  ['/locations', 200, 'Slovenia'],
  ['/locations/slovenia', 200, 'Slovenia'],
  ['/admin', 200, 'awaiting database setup'],
  ['/admin/companies/si-mediasped', 200, 'awaiting database setup'],
  ['/admin/submissions', 200, 'awaiting database setup'],
  ['/submit-company', 200, 'Company submissions will open soon'],
  ['/companies/spedicija-stori', 200, 'stori@siol.net'],
  ['/companies/gebrueder-weiss', 200, 'Leskoškova cesta 2'],
  ['/companies?page=3', 200, 'companies'],
  ['/companies?services=rail', 200, 'Rail freight'],
  ['/companies/missing-company', 404, 'page'],
  ['/companies/alpine-cargo', 404, 'page'],
  ['/locations/italy', 404, 'page'],
  ['/services/unknown', 404, 'page'],
];
for (const [path, status, content] of cases) {
  let url = new URL(path, 'http://localhost');
  let response;
  for (let hops = 0; hops < 5; hops++) {
    response = await server.fetch(new Request(url));
    const location = response.headers.get('location');
    if (![301, 302, 303, 307, 308].includes(response.status) || !location) break;
    await response.text();
    url = new URL(location, url);
    assert.equal(url.origin, 'http://localhost', 'Redirect stays on the local origin');
  }
  const html = await response.text();
  assert.equal(response.status, status, `${path}: HTTP status`);
  assert.ok(html.includes(content), `${path}: expected content ${content}`);
  assert.ok(!html.includes('We couldn’t load this page'), `${path}: no error boundary`);
  assert.ok(!html.includes('href="/?office='), `${path}: home links omit the market default`);
  if (path === '/') {
    assert.ok(html.includes('<title>Freight Forwarders in Slovenia | LogisticsWorld</title>'), 'Homepage search title');
    assert.ok(/<h1>Freight forwarders <em>in Slovenia\.<\/em><\/h1>/.test(html), 'Primary keyword in rendered H1');
    assert.ok(!html.includes('href="/?q='),'Navigation does not serialize empty search defaults');
    assert.ok(html.indexOf('href="/companies/mediasped"') < html.indexOf('href="/companies/abc-logistika"'), 'Mediašped is the first default result');
    assert.ok(html.includes('How to choose a freight forwarder in Slovenia'), 'Buyer guidance is server rendered');
    assert.ok(html.includes('https://logisticsworld.eu/'), 'Canonical uses the custom domain');
    assert.ok(html.includes('A little clarity before you ship.'), 'Homepage includes latest guides');
    assert.ok(html.includes('placement=homepage&amp;content=featured'), 'Homepage quotation link identifies the placement');
  }
  if (path === '/companies?office=SI') {
    assert.ok(html.includes('aria-controls="extra-filters"'), 'Additional filters have an accessible disclosure control');
    assert.ok(!html.includes('Office country'), 'No unnecessary office-country selector');
    assert.ok(html.includes('View company'), 'Each result has an explicit profile action');
  }
  if (path === '/blog') {
    assert.ok(html.includes('aria-label="Filter guides by topic"'), 'Blog filters have a group label');
    for (const slug of ['shipping-through-koper', 'fcl-or-lcl-container-shipping', 'freight-quote-checklist']) {
      assert.ok(html.includes(`href="/blog/${slug}"`), 'Every published guide is linked from the blog');
    }
  }
  if (path === '/services/customs') {
    assert.ok(html.includes('placement=service&amp;content=customs'), 'Service-page quote links preserve their service source');
    assert.ok(!html.includes('placement=directory&amp;content=listing'), 'Service result cards retain the service source');
  }
  if (path === '/locations/koper' || path === '/services/customs/koper') {
    const source = path === '/locations/koper' ? 'koper' : 'customs-koper';
    for (const anchor of ['directory-results', 'shipment-checklist', 'quote-costs', 'shipment-questions']) {
      assert.ok(html.includes(`href="#${anchor}"`), `${path}: in-page navigation links to ${anchor}`);
      assert.equal((html.match(new RegExp(` id="${anchor}"`, 'g')) || []).length, 1, `${path}: each anchor has one target`);
    }
    assert.ok(html.includes(`<link rel="canonical" href="https://logisticsworld.eu${path}"`), `${path}: canonical URL is retained`);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one primary heading`);
    assert.ok(html.includes('scope="col"') && html.includes('scope="row"'), `${path}: quote costs retain accessible table headings`);
    assert.ok(html.includes(`placement=location&amp;content=${source}`), `${path}: quotation actions retain their page attribution`);
    assert.ok(html.includes('Official references'), `${path}: factual guidance includes its sources`);
  }
  if (path === '/locations/ljubljana') {
    assert.ok(!html.includes('id="shipment-checklist"'), 'Koper shipment guidance is scoped to Koper pages');
  }
  if (path.startsWith('/blog/') && status === 200) {
    assert.ok(html.includes(`placement=blog&amp;content=${path.split('/').pop()}`), 'Article quote link identifies the originating article');
    assert.ok(html.includes(`rel="canonical" href="https://logisticsworld.eu${path}"`), 'Article has its own canonical URL');
    assert.ok(html.includes('property="og:type" content="article"'), 'Article social metadata');
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match=>JSON.parse(match[1]));
    const article = schemas.find(schema=>schema['@type']==='BlogPosting');
    assert.ok(article, 'Article structured data is server rendered');
    assert.equal(article['@type'], 'BlogPosting');
    assert.equal(article.mainEntityOfPage, `https://logisticsworld.eu${path}`);
    assert.ok(html.includes('Sources &amp; further reading'), 'Article includes source references');
    assert.ok(html.includes('aria-label="In this guide"'), 'Article includes a contents navigation');
  }
  if (path.startsWith('/?coverage=')) {
    assert.ok(!html.includes('>Mediašped</a>'), 'Homepage preserves the company type and coverage filters');
  }
  if (path === '/companies/mediasped') {
    assert.ok(html.includes('Featured partner'), 'Promotional company placement is labelled');
    assert.ok(html.includes('Start with your shipment'), 'Mediašped profile helps visitors prepare an enquiry');
    assert.ok(html.includes('/go/mediasped?placement=profile&amp;content=mediasped'), 'Profile has a source-tagged quotation link');
    assert.ok(html.includes('href="mailto:info@mediasped.com"'), 'Real email is actionable');
    assert.ok(html.includes('href="tel:+38641728712"'), 'Real phone is actionable');
    assert.ok(html.includes('Ferrarska ulica 30'), 'Office address is visible');
    assert.ok(html.includes('alt="Mediašped d.o.o. logo"'), 'Profile renders the company logo');
    assert.ok(html.includes('company-logo--profile'), 'Profile uses the larger logo frame');
    assert.ok(!html.includes('Sample company'), 'Real profile is not labelled fictional');
  }
  if (path === '/locations/slovenia') {
    assert.equal(url.pathname, '/companies', 'Old country navigation redirects to the Slovenian directory');
  }
  if (path.startsWith('/admin')) {
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.ok(!html.includes('Save draft'), 'Anonymous visitors cannot edit listings');
    assert.ok(!html.includes('Company catalog</h1>'), 'Anonymous visitors cannot read the private catalog');
  }
  if (!path.startsWith('/admin')) {
    for (const foreign of ['Adriatic Connect', 'Karst Customs', 'Alpine Cargo', 'Portline Logistics', 'Sava Distribution', 'Danube Freight', 'Rijeka Link', 'Vienna Freight Studio', 'Friuli Transport', 'Pannon Storage']) {
      assert.ok(!html.includes(foreign), `${path}: foreign provider ${foreign} is excluded`);
    }
    assert.ok(!html.includes('>Countries</a>'), `${path}: no country browsing in public navigation`);
  }
  if (status === 200) {
    assert.ok(html.includes('content="noindex, follow"'), `${path}: working preview remains excluded from indexing`);
    assert.equal((html.match(/<title>/g) || []).length, 1, `${path}: one resolved title`);
  }
  console.log(`PASS ${status} ${path}`);
}
const handoff = await server.fetch(new Request('http://localhost/go/mediasped?placement=service&content=sea'));
assert.equal(handoff.status, 302, 'Quotation handoff is a server redirect');
const quoteDestination = new URL(handoff.headers.get('location'));
assert.equal(quoteDestination.origin + quoteDestination.pathname, 'https://mediasped.com/en/request-quote/');
assert.equal(quoteDestination.searchParams.get('utm_content'), 'service:sea');
assert.equal((await server.fetch(new Request('http://localhost/go/mediasped?placement=blog&content=invalid'))).status, 400);
console.log('PASS: quotation handoff destination, attribution and invalid-source handling');
console.log(`${cases.length} server-rendering smoke checks passed.`);
