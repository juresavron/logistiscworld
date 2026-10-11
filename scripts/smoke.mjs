import assert from 'node:assert/strict';
import server from '../dist/server/server.js';

const cases = [
  ['/', 200, 'Best logistics companies'],
  ['/?q=zzzznonexistent', 200, 'No companies match'],
  ['/?q=Koper', 200, 'Adriatic Connect'],
  ['/?services=customs', 200, 'Customs clearance'],
  ['/?coverage=IT&type=Customs%20broker', 200, 'Karst Customs'],
  ['/?capabilities=Refrigerated%20cargo', 200, 'No companies match'],
  ['/companies', 200, 'Adriatic Connect'],
  ['/companies?office=SI', 200, 'in Slovenia.'],
  ['/companies?office=IT', 200, 'Adriatic Connect'],
  ['/companies?coverage=IT', 200, 'Karst Customs'],
  ['/companies?q=zzzznonexistent', 200, 'No companies'],
  ['/companies/adriatic-connect', 200, 'Adriatic Connect'],
  ['/compare?company=sample-01,sample-02', 200, 'Freight forwarders'],
  ['/services', 200, 'Road transport'],
  ['/services/customs', 200, 'Customs clearance'],
  ['/locations', 200, 'Slovenia'],
  ['/locations/slovenia', 200, 'Slovenia'],
  ['/admin', 200, 'Company catalog'],
  ['/admin/companies/sample-01', 200, 'Adriatic Connect'],
  ['/submit-company', 200, 'Tell us about your company'],
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
  if (path === '/') {
    assert.ok(html.includes('<title>Best Logistics Companies in Slovenia | LogisticsWorld</title>'), 'Homepage search title');
    assert.ok(/<h1>Best logistics companies <em>in Slovenia\.<\/em><\/h1>/.test(html), 'Primary keyword in rendered H1');
    assert.ok(html.includes('How to choose the best logistics company in Slovenia'), 'Buyer guidance is server rendered');
    assert.ok(html.includes('https://logisticsworld.worldfans.workers.dev/'), 'Canonical uses deployed origin');
  }
  if (path === '/companies?office=SI') {
    assert.ok(html.includes('aria-controls="extra-filters"'), 'Additional filters have an accessible disclosure control');
    assert.ok(!html.includes('Office country'), 'No unnecessary office-country selector');
    assert.ok(html.includes('View company'), 'Each result has an explicit profile action');
  }
  if (path.startsWith('/?coverage=')) {
    assert.ok(!html.includes('>Adriatic Connect</a>'), 'Homepage preserves the company type and coverage filters');
  }
  if (path === '/companies/adriatic-connect') {
    assert.ok(!html.includes('>Contact options'), 'Sample contact information does not require a dead-end modal');
  }
  if (path === '/locations/slovenia' || path === '/locations') {
    assert.equal(url.pathname, '/companies', 'Old country navigation redirects to the Slovenian directory');
  }
  if (!path.startsWith('/admin')) {
    for (const foreign of ['Alpine Cargo', 'Portline Logistics', 'Sava Distribution', 'Danube Freight', 'Rijeka Link', 'Vienna Freight Studio', 'Friuli Transport', 'Pannon Storage']) {
      assert.ok(!html.includes(foreign), `${path}: foreign provider ${foreign} is excluded`);
    }
    assert.ok(!html.includes('>Countries</a>'), `${path}: no country browsing in public navigation`);
  }
  if (status === 200) {
    assert.ok(html.includes('content="noindex, nofollow"'), `${path}: fictional preview remains excluded from indexing`);
    assert.equal((html.match(/<title>/g) || []).length, 1, `${path}: one resolved title`);
  }
  console.log(`PASS ${status} ${path}`);
}
console.log(`${cases.length} server-rendering smoke checks passed.`);
