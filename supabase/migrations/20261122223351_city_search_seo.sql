-- Match physical Slovenian offices. Ljubljana includes its explicitly named districts.
create or replace function public.search_companies(p_search jsonb default '{}'::jsonb) returns jsonb
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
      and (coalesce(p_search->>'city','')='' or exists(select 1 from jsonb_array_elements(p.payload->'offices') o where o->>'country'='SI' and (catalog_private.normalized(replace(replace(trim(o->>'city'),'–','-'),'—','-')) = catalog_private.normalized(replace(replace(trim(p_search->>'city'),'–','-'),'—','-')) or (catalog_private.normalized(trim(p_search->>'city'))='ljubljana' and starts_with(catalog_private.normalized(replace(replace(trim(o->>'city'),'–','-'),'—','-')),'ljubljana-')))))
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
