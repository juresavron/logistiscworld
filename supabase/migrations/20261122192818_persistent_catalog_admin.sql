-- Independent LogisticsWorld project only. No Mediašped/OnlyWorld/SavSale data is reused.
create schema if not exists catalog_private;
revoke all on schema catalog_private from public;
grant usage on schema catalog_private to authenticated;

create table public.admin_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('editor','administrator')),
  active boolean not null default true
);
create table public.company_drafts (
  id text primary key check (length(id) between 1 and 80),
  slug text unique,
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and payload->>'id' = id),
  version integer not null default 0 check (version >= 0),
  archived boolean not null default false,
  saved_at timestamptz not null default now()
);
create table public.company_revisions (
  company_id text not null references public.company_drafts(id),
  version integer not null,
  payload jsonb not null,
  action text not null check (action in ('draft','publish','archive')),
  actor_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  primary key(company_id, version)
);
create table public.company_publications (
  id text primary key references public.company_drafts(id),
  slug text not null unique,
  payload jsonb not null,
  name text not null,
  search_document text not null,
  featured boolean not null default false,
  published_at timestamptz not null default now()
);
create index company_publications_name on public.company_publications(name, id);

alter table public.admin_memberships enable row level security;
alter table public.company_drafts enable row level security;
alter table public.company_revisions enable row level security;
alter table public.company_publications enable row level security;
revoke all on public.admin_memberships, public.company_drafts, public.company_revisions, public.company_publications from anon, authenticated;
grant select on public.admin_memberships, public.company_publications to authenticated;
grant select on public.company_publications to anon;
create policy own_membership on public.admin_memberships for select to authenticated using (user_id = (select auth.uid()));
create policy published_catalog on public.company_publications for select to anon, authenticated using (true);

create function catalog_private.editor_role() returns text
language plpgsql stable security definer set search_path = '' as $$
declare result text;
begin
  if auth.uid() is null then raise insufficient_privilege using message = 'Authentication required'; end if;
  select role into result from public.admin_memberships where user_id = auth.uid() and active;
  if result is null then raise insufficient_privilege using message = 'Editor permission required'; end if;
  return result;
end;
$$;
revoke all on function catalog_private.editor_role() from public;
grant execute on function catalog_private.editor_role() to authenticated;

create function catalog_private.normalized(p_text text) returns text
language sql immutable parallel safe set search_path = '' as $$
  select regexp_replace(normalize(lower(p_text), NFD), U&'[\0300-\036f]', '', 'g');
$$;
revoke all on function catalog_private.normalized(text) from public;
grant usage on schema catalog_private to anon;
grant execute on function catalog_private.normalized(text) to anon, authenticated;

create function catalog_private.validate_company(p jsonb, publishing boolean) returns void
language plpgsql set search_path = '' as $$
declare field text; item jsonb; office jsonb; service text; parsed_date date;
begin
  if jsonb_typeof(p) is distinct from 'object' or pg_column_size(p) > 50000 then
    raise invalid_parameter_value using message = 'Invalid company';
  end if;
  foreach field in array array['id','slug','name','legalName','summary','description','website','email','phone','whatsapp','sourceUrl','checkedAt','tone','initials'] loop
    if jsonb_typeof(p->field) is distinct from 'string' then raise invalid_parameter_value using message = 'Missing company field'; end if;
  end loop;
  if length(p->>'id') not between 1 and 80 or length(p->>'slug') > 100 or length(p->>'name') > 100
    or length(p->>'legalName') > 150 or length(p->>'summary') > 260 or length(p->>'description') > 3000
    or length(p->>'initials') not between 1 and 3 or p->>'tone' not in ('green','blue','rust','plum')
    or jsonb_typeof(p->'isSample') is distinct from 'boolean'
    or (p ? 'featured' and jsonb_typeof(p->'featured') <> 'boolean') then
    raise invalid_parameter_value using message = 'Invalid company field';
  end if;
  foreach field in array array['website','sourceUrl'] loop
    if length(p->>field) > 300 or (p->>field <> '' and (p->>field !~ '^https://[^/?#[:space:]@]+([/?#]|$)' or p->>field ~ '[[:cntrl:]]')) then
      raise invalid_parameter_value using message = 'Invalid website';
    end if;
  end loop;
  if length(p->>'email') > 150 or (p->>'email' <> '' and p->>'email' !~ '^[^[:space:]@?&#]+@[^[:space:]@?&#]+\.[^[:space:]@?&#]+$') then raise invalid_parameter_value using message = 'Invalid email'; end if;
  foreach field in array array['phone','whatsapp'] loop
    if p->>field <> '' and p->>field !~ '^\+[1-9][0-9]{6,14}$' then raise invalid_parameter_value using message = 'Invalid phone'; end if;
  end loop;
  foreach field in array array['types','services','capabilities','offices','coverage'] loop
    if jsonb_typeof(p->field) is distinct from 'array' then raise invalid_parameter_value using message = 'Invalid company list'; end if;
  end loop;
  if jsonb_array_length(p->'types') > 4 or jsonb_array_length(p->'services') > 7 or jsonb_array_length(p->'capabilities') > 4
    or jsonb_array_length(p->'offices') not between 1 and 20 or jsonb_array_length(p->'coverage') > 7 then raise invalid_parameter_value using message = 'Company list too long'; end if;
  for item in select value from jsonb_array_elements(p->'types') loop
    if item #>> '{}' not in ('Freight forwarder','Carrier','Customs broker','Warehouse operator') or jsonb_typeof(item) <> 'string' then raise invalid_parameter_value using message = 'Invalid type'; end if;
  end loop;
  for item in select value from jsonb_array_elements(p->'services') loop
    if item #>> '{}' not in ('road','sea','air','customs','warehouse','forwarding','rail') or jsonb_typeof(item) <> 'string' then raise invalid_parameter_value using message = 'Invalid service'; end if;
  end loop;
  for item in select value from jsonb_array_elements(p->'capabilities') loop
    if item #>> '{}' not in ('Refrigerated cargo','Dangerous goods','Oversized cargo','E-commerce fulfilment') or jsonb_typeof(item) <> 'string' then raise invalid_parameter_value using message = 'Invalid capability'; end if;
  end loop;
  for office in select value from jsonb_array_elements(p->'offices') loop
    if jsonb_typeof(office) <> 'object' or jsonb_typeof(office->'city') is distinct from 'string' or length(office->>'city') > 80
      or coalesce(office->>'country','') not in ('SI','IT','AT','HR','HU','DE') or jsonb_typeof(office->'primary') is distinct from 'boolean' then raise invalid_parameter_value using message = 'Invalid office'; end if;
    foreach field in array array['address','postalCode','email','phone','fax'] loop
      if office ? field and (jsonb_typeof(office->field) <> 'string' or length(office->>field) > 200) then raise invalid_parameter_value using message = 'Invalid office field'; end if;
    end loop;
    foreach field in array array['phone','fax'] loop
      if office ? field and office->>field !~ '^\+[1-9][0-9]{6,14}$' then raise invalid_parameter_value using message = 'Invalid office phone'; end if;
    end loop;
    if office ? 'email' and (length(office->>'email') > 150 or office->>'email' !~ '^[^[:space:]@?&#]+@[^[:space:]@?&#]+\.[^[:space:]@?&#]+$') then raise invalid_parameter_value using message = 'Invalid office email'; end if;
    if office ? 'postalCode' and length(office->>'postalCode') > 20 then raise invalid_parameter_value using message = 'Invalid postcode'; end if;
  end loop;
  for item in select value from jsonb_array_elements(p->'coverage') loop
    if jsonb_typeof(item) <> 'object' or not (p->'services' ? coalesce(item->>'service','')) or jsonb_typeof(item->'countries') is distinct from 'array'
      then raise invalid_parameter_value using message = 'Invalid coverage'; end if;
    if jsonb_array_length(item->'countries') > 6 or exists (select 1 from jsonb_array_elements(item->'countries') c where jsonb_typeof(c) <> 'string' or c #>> '{}' not in ('SI','IT','AT','HR','HU','DE')) then raise invalid_parameter_value using message = 'Invalid coverage country'; end if;
  end loop;
  if (select count(*) <> count(distinct value->>'service') from jsonb_array_elements(p->'coverage')) then raise invalid_parameter_value using message = 'Duplicate coverage service'; end if;
  if p ? 'listingNote' and (jsonb_typeof(p->'listingNote') <> 'string' or length(p->>'listingNote') > 2000) then raise invalid_parameter_value using message = 'Invalid source note'; end if;
  foreach field in array array['serviceDetails','additionalSources'] loop
    if p ? field then
      if jsonb_typeof(p->field) <> 'array' or jsonb_array_length(p->field) > (case when field='serviceDetails' then 20 else 10 end) then raise invalid_parameter_value using message = 'Invalid supplementary details'; end if;
      for item in select value from jsonb_array_elements(p->field) loop
        if jsonb_typeof(item) <> 'string' or length(item #>> '{}') > (case when field='serviceDetails' then 200 else 300 end)
          or (field='additionalSources' and item #>> '{}' !~ '^https://[^/?#[:space:]@]+([/?#]|$)') then raise invalid_parameter_value using message = 'Invalid supplementary detail'; end if;
      end loop;
    end if;
  end loop;
  if p->>'checkedAt' <> '' then
    begin parsed_date := (p->>'checkedAt')::date; exception when others then raise invalid_parameter_value using message = 'Invalid review date'; end;
    if p->>'checkedAt' !~ '^\d{4}-\d{2}-\d{2}$' then raise invalid_parameter_value using message = 'Invalid review date'; end if;
  end if;
  if publishing then
    if p->>'slug' !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(p->>'slug') < 3 or length(trim(p->>'name')) < 3
      or length(trim(p->>'legalName')) < 3 or length(trim(p->>'summary')) < 25 or (p->>'isSample')::boolean
      or jsonb_array_length(p->'types') = 0 or jsonb_array_length(p->'services') = 0
      or not exists (select 1 from jsonb_array_elements(p->'offices') o where o->>'country' = 'SI')
      or (select count(*) from jsonb_array_elements(p->'offices') o where o->>'primary' = 'true') <> 1
      or exists (select 1 from jsonb_array_elements(p->'offices') o where length(trim(o->>'city')) < 2)
      or (p->>'website' = '' and p->>'email' = '' and p->>'phone' = '') or p->>'sourceUrl' = ''
      or parsed_date is null or parsed_date > current_date then raise invalid_parameter_value using message = 'Company is not ready to publish'; end if;
  end if;
end;
$$;
revoke all on function catalog_private.validate_company(jsonb, boolean) from public;

create function catalog_private.search_document(p jsonb) returns text
language sql immutable security invoker set search_path = '' as $$
  select catalog_private.normalized(concat_ws(' ', p->>'name',p->>'summary',p->>'description',
      p->'serviceDetails',p->'types',p->'capabilities',p->'offices',
      (select string_agg(case value when 'road' then 'Road transport' when 'sea' then 'Sea freight' when 'air' then 'Air freight' when 'customs' then 'Customs clearance' when 'warehouse' then 'Warehousing' when 'forwarding' then 'Freight forwarding' when 'rail' then 'Rail freight' end,' ') from jsonb_array_elements_text(p->'services')),
      'Slovenia'));
$$;
revoke all on function catalog_private.search_document(jsonb) from public;

create function catalog_private.catalog_entry(p_id text) returns jsonb
language sql stable security invoker set search_path = '' as $$
 select jsonb_build_object('draft', d.payload, 'published', p.payload, 'version', d.version, 'savedAt', d.saved_at, 'archived', d.archived)
 from public.company_drafts d left join public.company_publications p using(id) where d.id = p_id;
$$;
revoke all on function catalog_private.catalog_entry(text) from public;

create function catalog_private.admin_catalog() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform catalog_private.editor_role();
  return coalesce((select jsonb_agg(catalog_private.catalog_entry(id) order by lower(payload->>'name'), id) from public.company_drafts), '[]'::jsonb);
end;
$$;
revoke all on function catalog_private.admin_catalog() from public;
grant execute on function catalog_private.admin_catalog() to authenticated;
create function public.admin_catalog() returns jsonb language sql security invoker set search_path = '' as $$ select catalog_private.admin_catalog(); $$;
revoke all on function public.admin_catalog() from public;
grant execute on function public.admin_catalog() to authenticated;

create function catalog_private.save_company(p_draft jsonb, p_expected_version integer, p_publish boolean) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare current_row public.company_drafts; editor text; previous_slug text; document text;
begin
  editor := catalog_private.editor_role();
  if p_expected_version is null or p_expected_version < 0 or p_publish is null then raise invalid_parameter_value; end if;
  if p_publish and editor <> 'administrator' then raise insufficient_privilege; end if;
  perform catalog_private.validate_company(p_draft, p_publish);
  insert into public.company_drafts(id, slug, payload) values(p_draft->>'id', nullif(p_draft->>'slug',''), p_draft) on conflict(id) do nothing;
  select * into current_row from public.company_drafts where id = p_draft->>'id' for update;
  if current_row.version <> p_expected_version then raise serialization_failure using message = 'Company version conflict'; end if;
  if editor <> 'administrator' and coalesce((p_draft->>'featured')::boolean, false) is distinct from coalesce((current_row.payload->>'featured')::boolean, false) then raise insufficient_privilege; end if;
  if editor <> 'administrator' and current_row.version = 0 and coalesce((p_draft->>'featured')::boolean,false) then raise insufficient_privilege; end if;
  select slug into previous_slug from public.company_publications where id = current_row.id;
  if previous_slug is not null and previous_slug <> p_draft->>'slug' then raise invalid_parameter_value using message = 'Published profile URLs cannot be changed'; end if;
  if exists(select 1 from public.company_publications where slug = p_draft->>'slug' and id <> current_row.id) then raise unique_violation; end if;
  update public.company_drafts set payload = p_draft, slug = nullif(p_draft->>'slug',''), version = version + 1,
    archived = case when p_publish then false else archived end, saved_at = now() where id = current_row.id returning * into current_row;
  if p_publish then
    document := catalog_private.search_document(p_draft);
    insert into public.company_publications(id, slug, payload, name, search_document, featured) values(current_row.id, p_draft->>'slug', p_draft, p_draft->>'name', document, coalesce((p_draft->>'featured')::boolean,false))
    on conflict(id) do update set payload=excluded.payload, name=excluded.name, search_document=excluded.search_document, featured=excluded.featured, published_at=now();
  end if;
  insert into public.company_revisions(company_id, version, payload, action, actor_id) values(current_row.id,current_row.version,p_draft,case when p_publish then 'publish' else 'draft' end,auth.uid());
  return catalog_private.catalog_entry(current_row.id);
end;
$$;
revoke all on function catalog_private.save_company(jsonb,integer,boolean) from public;
grant execute on function catalog_private.save_company(jsonb,integer,boolean) to authenticated;
create function public.save_company(p_draft jsonb, p_expected_version integer, p_publish boolean) returns jsonb language sql security invoker set search_path = '' as $$ select catalog_private.save_company(p_draft, p_expected_version, p_publish); $$;
revoke all on function public.save_company(jsonb,integer,boolean) from public;
grant execute on function public.save_company(jsonb,integer,boolean) to authenticated;

create function catalog_private.archive_company(p_id text, p_expected_version integer) returns void
language plpgsql security definer set search_path = '' as $$
declare current_row public.company_drafts;
begin
  if catalog_private.editor_role() <> 'administrator' then raise insufficient_privilege; end if;
  select * into current_row from public.company_drafts where id=p_id for update;
  if not found or current_row.version <> p_expected_version then raise serialization_failure; end if;
  update public.company_drafts set archived=true,version=version+1,saved_at=now() where id=p_id;
  delete from public.company_publications where id=p_id;
  insert into public.company_revisions(company_id,version,payload,action,actor_id) values(p_id,current_row.version+1,current_row.payload,'archive',auth.uid());
end;
$$;
revoke all on function catalog_private.archive_company(text,integer) from public;
grant execute on function catalog_private.archive_company(text,integer) to authenticated;
create function public.archive_company(p_id text,p_expected_version integer) returns void language sql security invoker set search_path = '' as $$ select catalog_private.archive_company(p_id,p_expected_version); $$;
revoke all on function public.archive_company(text,integer) from public;
grant execute on function public.archive_company(text,integer) to authenticated;

create function public.search_companies(p_search jsonb default '{}'::jsonb) returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
declare requested integer; total integer; pages integer; page integer; result jsonb; terms text[]; selected_services jsonb; selected_caps jsonb; destination text; selected_type text; alphabetical boolean;
begin
  if jsonb_typeof(p_search) <> 'object' or pg_column_size(p_search) > 4096 then raise invalid_parameter_value; end if;
  requested := greatest(1,least(10000,coalesce((p_search->>'page')::integer,1)));
  terms := regexp_split_to_array(trim(catalog_private.normalized(left(coalesce(p_search->>'q',''),100))), '\s+');
  selected_services := coalesce(p_search->'services','[]'::jsonb); selected_caps := coalesce(p_search->'capabilities','[]'::jsonb);
  if jsonb_typeof(selected_services) <> 'array' or jsonb_typeof(selected_caps) <> 'array' then raise invalid_parameter_value; end if;
  destination := coalesce(p_search->>'coverage',''); selected_type := coalesce(p_search->>'type',''); alphabetical := p_search->>'sort' = 'name';
  with matches as materialized (
    select p.* from public.company_publications p where
      not exists(select 1 from unnest(terms) term where term <> '' and position(term in p.search_document) = 0)
      and (jsonb_array_length(selected_services)=0 or exists(select 1 from jsonb_array_elements_text(selected_services) s where p.payload->'services' ? s))
      and (destination='' or exists(select 1 from jsonb_array_elements(p.payload->'coverage') c where c->'countries' ? destination and (jsonb_array_length(selected_services)=0 or selected_services ? (c->>'service'))))
      and (selected_type='' or p.payload->'types' ? selected_type)
      and p.payload->'capabilities' @> selected_caps
  ), counts as (select count(*)::integer n from matches), bounds as (select n, greatest(1,(n+11)/12) np from counts), selection as (
    select payload from matches order by case when not coalesce(alphabetical,false) then featured else false end desc,
      case when not coalesce(alphabetical,false) and coalesce(p_search->>'q','') <> '' then starts_with(catalog_private.normalized(name),catalog_private.normalized(p_search->>'q')) else false end desc,
      lower(name) collate "C", id limit 12 offset ((select least(requested,np) from bounds)-1)*12
  ) select b.n,b.np,least(requested,b.np),coalesce((select jsonb_agg(payload) from selection),'[]'::jsonb) into total,pages,page,result from bounds b;
  return jsonb_build_object('companies',result,'total',total,'page',page,'pages',pages);
end;
$$;
revoke all on function public.search_companies(jsonb) from public;
grant execute on function public.search_companies(jsonb) to anon, authenticated;
