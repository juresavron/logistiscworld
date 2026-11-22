-- Supabase gives anon an explicit function EXECUTE grant by default in public.
-- Revoking PUBLIC alone does not remove that grant. Keep anonymous RPC access
-- limited to published-catalog search, independently of the inner role checks.
revoke all on function public.admin_catalog() from public, anon, authenticated;
revoke all on function public.save_company(jsonb,integer,boolean) from public, anon, authenticated;
revoke all on function public.archive_company(text,integer) from public, anon, authenticated;
revoke all on function public.search_companies(jsonb) from public, anon, authenticated;
grant execute on function public.admin_catalog() to authenticated;
grant execute on function public.save_company(jsonb,integer,boolean) to authenticated;
grant execute on function public.archive_company(text,integer) to authenticated;
grant execute on function public.search_companies(jsonb) to anon, authenticated;
