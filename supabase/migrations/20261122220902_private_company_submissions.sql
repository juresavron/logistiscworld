-- Private intake only. No visitor can publish, read submitted contacts or assign a role.
create table public.company_submissions (
  id uuid primary key,
  company text not null check (length(company) between 3 and 100),
  website text not null check (length(website) between 1 and 300),
  email text not null check (length(email) between 3 and 150),
  status text not null default 'pending' check (status in ('pending','reviewed','rejected')),
  note text not null default '' check (length(note) <= 1000),
  version integer not null default 1 check (version >= 1),
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);
create index company_submissions_status_created on public.company_submissions(status, created_at desc, id);
create index company_submissions_email_created on public.company_submissions(email, created_at desc);
create index company_submissions_created on public.company_submissions(created_at desc);
create index company_submissions_reviewed_by on public.company_submissions(reviewed_by);
create table catalog_private.submission_reviews (
  submission_id uuid not null references public.company_submissions(id),
  version integer not null,
  status text not null,
  note text not null,
  actor_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  primary key(submission_id, version)
);
create index submission_reviews_actor on catalog_private.submission_reviews(actor_id);
alter table public.company_submissions enable row level security;
alter table catalog_private.submission_reviews enable row level security;
revoke all on public.company_submissions, catalog_private.submission_reviews from public, anon, authenticated;

create function catalog_private.submit_company(p_id uuid, p_company text, p_website text, p_email text, p_consent boolean) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare previous public.company_submissions; normalized_company text := btrim(p_company); normalized_website text := btrim(p_website); normalized_email text := lower(btrim(p_email));
begin
  if p_id is null or p_consent is distinct from true
    or normalized_company is null or length(normalized_company) not between 3 and 100 or normalized_company ~ '[[:cntrl:]]'
    or normalized_website is null or length(normalized_website) not between 1 and 300
    or normalized_website !~ '^https://[^/?#[:space:]@]+([/?#]|$)' or normalized_website ~ '[[:cntrl:][:space:]]'
    or normalized_email is null or length(normalized_email) > 150 or normalized_email !~ '^[^[:space:]@?&#]+@[^[:space:]@?&#]+\.[^[:space:]@?&#]+$'
    then raise invalid_parameter_value using message = 'Invalid submission'; end if;
  -- A short, global transaction lock makes quotas and duplicate retries atomic,
  -- including calls made directly to PostgREST rather than through the website.
  perform pg_catalog.pg_advisory_xact_lock(937412, 1);
  select * into previous from public.company_submissions where id = p_id;
  if found then
    if previous.company <> normalized_company or previous.website <> normalized_website or previous.email <> normalized_email then
      raise invalid_parameter_value using message = 'Request reference already used';
    end if;
    return jsonb_build_object('reference', p_id);
  end if;
  if (select count(*) from public.company_submissions where email = normalized_email and created_at > now() - interval '24 hours') >= 3
    or (select count(*) from public.company_submissions where created_at > now() - interval '1 hour') >= 100 then
    raise program_limit_exceeded using message = 'Submission limit reached';
  end if;
  insert into public.company_submissions(id,company,website,email) values(p_id,normalized_company,normalized_website,normalized_email);
  return jsonb_build_object('reference', p_id);
end;
$$;
revoke all on function catalog_private.submit_company(uuid,text,text,text,boolean) from public, anon, authenticated;
grant execute on function catalog_private.submit_company(uuid,text,text,text,boolean) to anon, authenticated;
create function public.submit_company(p_id uuid, p_company text, p_website text, p_email text, p_consent boolean) returns jsonb
language sql security invoker set search_path = '' as $$ select catalog_private.submit_company(p_id,p_company,p_website,p_email,p_consent); $$;
revoke all on function public.submit_company(uuid,text,text,text,boolean) from public, anon, authenticated;
grant execute on function public.submit_company(uuid,text,text,text,boolean) to anon, authenticated;

create function catalog_private.submission_inbox(p_status text, p_page integer) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare total integer; pages integer; page integer; records jsonb;
begin
  perform catalog_private.editor_role();
  if p_status is null or p_status not in ('all','pending','reviewed','rejected') or p_page is null or p_page not between 1 and 10000 then raise invalid_parameter_value; end if;
  select count(*)::integer into total from public.company_submissions where p_status = 'all' or status = p_status;
  pages := greatest(1, (total + 19) / 20); page := least(p_page, pages);
  select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'company',s.company,'website',s.website,'email',s.email,'status',s.status,'note',s.note,'version',s.version,'createdAt',s.created_at,'reviewedAt',s.reviewed_at) order by s.created_at desc,s.id), '[]'::jsonb)
    into records from (select * from public.company_submissions where p_status = 'all' or status = p_status order by created_at desc,id limit 20 offset (page - 1) * 20) s;
  return jsonb_build_object('submissions',records,'total',total,'page',page,'pages',pages);
end;
$$;
revoke all on function catalog_private.submission_inbox(text,integer) from public, anon, authenticated;
grant execute on function catalog_private.submission_inbox(text,integer) to authenticated;
create function public.submission_inbox(p_status text, p_page integer) returns jsonb
language sql security invoker set search_path = '' as $$ select catalog_private.submission_inbox(p_status,p_page); $$;
revoke all on function public.submission_inbox(text,integer) from public, anon, authenticated;
grant execute on function public.submission_inbox(text,integer) to authenticated;

create function catalog_private.review_submission(p_id uuid, p_expected_version integer, p_status text, p_note text) returns void
language plpgsql security definer set search_path = '' as $$
declare previous public.company_submissions;
begin
  perform catalog_private.editor_role();
  if p_expected_version is null or p_expected_version < 1 or p_status is null or p_status not in ('pending','reviewed','rejected') or p_note is null or length(p_note) > 1000 then raise invalid_parameter_value; end if;
  select * into previous from public.company_submissions where id = p_id for update;
  if not found or previous.version <> p_expected_version then raise serialization_failure using message = 'Submission version conflict'; end if;
  update public.company_submissions set status=p_status,note=btrim(p_note),version=version+1,reviewed_at=now(),reviewed_by=auth.uid() where id=p_id;
  insert into catalog_private.submission_reviews(submission_id,version,status,note,actor_id) values(p_id,previous.version+1,p_status,btrim(p_note),auth.uid());
end;
$$;
revoke all on function catalog_private.review_submission(uuid,integer,text,text) from public, anon, authenticated;
grant execute on function catalog_private.review_submission(uuid,integer,text,text) to authenticated;
create function public.review_submission(p_id uuid, p_expected_version integer, p_status text, p_note text) returns void
language sql security invoker set search_path = '' as $$ select catalog_private.review_submission(p_id,p_expected_version,p_status,p_note); $$;
revoke all on function public.review_submission(uuid,integer,text,text) from public, anon, authenticated;
grant execute on function public.review_submission(uuid,integer,text,text) to authenticated;
