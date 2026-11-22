import fs from 'node:fs';
import { catalogData } from './catalog-data.mjs';
const catalog = await catalogData();
const seed = `-- Generated from the sourced launch catalog. Only valid on an empty independent project.
-- No users or administrator memberships are created by this seed.
begin;
do $seed$
declare company jsonb;
begin
  if exists(select 1 from public.company_drafts) then raise exception 'Seed only an empty LogisticsWorld database'; end if;
  for company in select value from jsonb_array_elements($catalog$${JSON.stringify(catalog)}$catalog$::jsonb) loop
    perform catalog_private.validate_company(company,true);
    insert into public.company_drafts(id,slug,payload,version) values(company->>'id',company->>'slug',company,1);
    insert into public.company_publications(id,slug,payload,name,search_document,featured) values(company->>'id',company->>'slug',company,company->>'name',catalog_private.search_document(company),coalesce((company->>'featured')::boolean,false));
    insert into public.company_revisions(company_id,version,payload,action) values(company->>'id',1,company,'publish');
  end loop;
end;
$seed$;
commit;
`;
fs.writeFileSync('supabase/seed.sql',seed);
console.log(`Prepared ${catalog.length} sourced company listings.`);
