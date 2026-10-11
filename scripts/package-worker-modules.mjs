import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

// Alternative API transport for the sample preview when native asset uploads
// cannot be authenticated by a deployment connector. Normal Wrangler deploys
// continue to use Cloudflare's native static-asset storage.
const walk = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const config = JSON.parse(fs.readFileSync('dist/server/wrangler.json', 'utf8'));
const modules = walk('dist/server').filter(file => file.endsWith('.js')).map(file => ({
  name: path.relative('dist/server', file),
  type: 'application/javascript+module',
  content: fs.readFileSync(file, 'utf8'),
}));
const imports = ['import handler from "./index.js";'];
const entries = [];
for (const [index, file] of walk('dist/client/assets').entries()) {
  const extension = path.extname(file);
  if (!['.js', '.css'].includes(extension)) throw new Error(`Review unsupported asset: ${file}`);
  const body = fs.readFileSync(file, 'utf8');
  const type = extension === '.js' ? 'application/javascript' : 'text/css';
  const etag = '"' + createHash('sha256').update(body).digest('hex') + '"';
  const name = `public-asset-${index}.txt`;
  modules.push({ name, type: 'text/plain', content: body });
  imports.push(`import asset${index} from "./${name}";`);
  entries.push(`[${JSON.stringify('/'+path.relative('dist/client',file))},{body:asset${index},type:${JSON.stringify(type)},etag:${JSON.stringify(etag)}}]`);
}
const entry = `${imports.join('\n')}
const assets = new Map([${entries.join(',')}]);
export default {
  async fetch(request, env, ctx) {
    const pathname = new URL(request.url).pathname;
    const asset = assets.get(pathname);
    if (asset) {
      if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', {status:405,headers:{Allow:'GET, HEAD'}});
      const headers = {'Content-Type':asset.type+'; charset=utf-8','Cache-Control':'public, max-age=31536000, immutable','ETag':asset.etag,'X-Content-Type-Options':'nosniff'};
      if (request.headers.get('If-None-Match') === asset.etag) return new Response(null,{status:304,headers});
      return new Response(request.method === 'HEAD' ? null : asset.body,{headers});
    }
    if (pathname.startsWith('/assets/')) return new Response('Not found',{status:404});
    return handler.fetch(request, env, ctx);
  }
};
`;
modules.push({name:'demo-entry.js',type:'application/javascript+module',content:entry});
const metadata = {
  main_module:'demo-entry.js',
  compatibility_date:config.compatibility_date,
  compatibility_flags:config.compatibility_flags,
  observability:config.observability,
  bindings:[],
};
const payload = JSON.stringify({metadata,modules});
fs.writeFileSync('dist/worker-modules.json', payload);
fs.writeFileSync('dist/worker-modules.json.gz', gzipSync(payload));
console.log(`Packaged ${modules.length} modules for API upload; no credentials included.`);
