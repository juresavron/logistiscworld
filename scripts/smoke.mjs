import assert from 'node:assert/strict';
import server from '../dist/server/server.js';

const cases = [
  ['/', 200, 'Find the people'],
  ['/companies', 200, 'Adriatic Connect'],
  ['/companies?q=zzzznonexistent', 200, 'No companies'],
  ['/companies/adriatic-connect', 200, 'Adriatic Connect'],
  ['/compare?company=sample-01,sample-02', 200, 'Adriatic Connect'],
  ['/services', 200, 'Road transport'],
  ['/services/customs', 200, 'Customs clearance'],
  ['/locations', 200, 'Slovenia'],
  ['/locations/slovenia', 200, 'Slovenia'],
  ['/admin', 200, 'Company catalog'],
  ['/admin/companies/sample-01', 200, 'Adriatic Connect'],
  ['/submit-company', 200, 'Tell us about your company'],
  ['/companies/missing-company', 404, 'page'],
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
  console.log(`PASS ${status} ${path}`);
}
console.log(`${cases.length} server-rendering smoke checks passed.`);
