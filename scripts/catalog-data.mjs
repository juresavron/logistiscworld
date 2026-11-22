import { build } from 'esbuild';
export async function catalogData() {
  const result = await build({ entryPoints: ['src/data/slovenian-companies.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
  const module = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
  return module.slovenianCompanies;
}
