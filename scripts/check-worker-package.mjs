import assert from 'node:assert/strict';
import fs from 'node:fs';

// Verify the exact packaged static-asset handler without network access.
// Replace only module imports; the request-handling code stays unchanged.
const payload = JSON.parse(fs.readFileSync('dist/worker-modules.json', 'utf8'));
const modules = new Map(payload.modules.map(module => [module.name, module]));
let entry = modules.get('demo-entry.js').content;
entry = entry.replace('import handler from "./index.js";', 'const handler = {fetch: () => new Response("SSR route")};');
entry = entry.replace(/import (asset\d+) from "\.\/(public-asset-\d+\.txt)";/g, (_, name, file) => `const ${name} = ${JSON.stringify(modules.get(file).content)};`);
const { default: worker } = await import('data:text/javascript;base64,' + Buffer.from(entry).toString('base64'));
const base = 'https://example.test';
const assets = fs.readdirSync('dist/client/assets');
for (const file of assets) {
  const url = `${base}/assets/${file}`;
  const response = await worker.fetch(new Request(url));
  assert.equal(response.status, 200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), fs.readFileSync(`dist/client/assets/${file}`), file);
  const extension = file.slice(file.lastIndexOf('.'));
  const expected = {'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.gif':'image/gif','.css':'text/css','.js':'application/javascript'}[extension];
  assert.ok(expected, `Supported MIME type for ${file}`);
  assert.ok(response.headers.get('content-type').startsWith(expected));
  const head = await worker.fetch(new Request(url, {method:'HEAD'}));
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  const cached = await worker.fetch(new Request(url, {headers:{'If-None-Match':response.headers.get('etag')}}));
  assert.equal(cached.status, 304);
}
const assetUrl = `${base}/assets/${assets[0]}`;
assert.equal((await worker.fetch(new Request(assetUrl, {method:'POST'}))).status, 405);
assert.equal((await worker.fetch(new Request(`${base}/assets/not-found.jpg`))).status, 404);
assert.equal(await (await worker.fetch(new Request(`${base}/companies`))).text(), 'SSR route');
console.log(`PASS: ${assets.length} packaged assets preserve bytes, MIME types, HEAD and cache responses; route forwarding and errors verified.`);
