create extension if not exists pgcrypto;

create type public.app_role as enum ('member', 'admin');
create type public.profile_status as enum ('active', 'blocked');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'closed', 'spam');
create type public.post_status as enum ('draft', 'published', 'archived');
create type public.session_status as enum ('scheduled', 'cancelled', 'completed');
create type public.booking_status as enum ('confirmed', 'waitlisted', 'cancelled', 'attended', 'no_show');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.app_role not null default 'member',
  status public.profile_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_type text not null default 'trial' check (lead_type in ('trial', 'consultation', 'contact', 'newsletter')),
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  interest text not null default 'Tư vấn chung',
  preferred_time text not null default '',
  note text not null default '',
  source_path text not null default '',
  status public.lead_status not null default 'new',
  marketing_consent boolean not null default false,
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email <> '' or phone <> '')
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);

create table public.coaches (
  id text primary key,
  name text not null,
  specialty text not null default '',
  image_path text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.class_sessions (
  id text primary key,
  program text not null,
  format text not null,
  coach_id text not null references public.coaches(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  floor text not null default '',
  level text not null default 'Mọi trình độ',
  capacity integer not null check (capacity > 0 and capacity <= 500),
  status public.session_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index class_sessions_starts_at_idx on public.class_sessions (starts_at);
create index class_sessions_status_idx on public.class_sessions (status);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.class_sessions(id),
  user_id uuid not null references public.profiles(id),
  status public.booking_status not null default 'confirmed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create index bookings_created_at_idx on public.bookings (created_at desc);
create index bookings_session_status_idx on public.bookings (session_id, status);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null,
  title text not null,
  excerpt text not null,
  content text not null,
  hero_image_path text not null check (hero_image_path ~ '^/assets/images/[a-zA-Z0-9_./-]+$'),
  author_name text not null default 'HYPE Training Lab',
  status public.post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(title) between 3 and 180),
  check (length(excerpt) between 10 and 500),
  check (length(content) between 20 and 20000)
);

create index blog_posts_status_published_idx on public.blog_posts (status, published_at desc);

create table public.admin_audit_logs (
  id bigint generated always as identity primary key,
  admin_id uuid not null references public.profiles(id),
  action text not null,
  target_table text not null,
  target_id text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create index admin_audit_logs_created_at_idx on public.admin_audit_logs (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger leads_set_updated_at before update on public.leads
for each row execute function public.set_updated_at();
create trigger coaches_set_updated_at before update on public.coaches
for each row execute function public.set_updated_at();
create trigger class_sessions_set_updated_at before update on public.class_sessions
for each row execute function public.set_updated_at();
create trigger bookings_set_updated_at before update on public.bookings
for each row execute function public.set_updated_at();
create trigger blog_posts_set_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert or update of email on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.submit_lead(
  p_lead_type text,
  p_full_name text,
  p_email text,
  p_phone text,
  p_interest text,
  p_preferred_time text,
  p_note text,
  p_source_path text,
  p_marketing_consent boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_id uuid;
  new_id uuid;
begin
  if p_lead_type not in ('trial', 'consultation', 'contact', 'newsletter') then
    raise exception 'invalid lead type';
  end if;
  if length(trim(coalesce(p_email, ''))) > 254
    or length(trim(coalesce(p_phone, ''))) > 30
    or (trim(coalesce(p_email, '')) = '' and trim(coalesce(p_phone, '')) = '') then
    raise exception 'invalid contact';
  end if;

  select id into existing_id
  from public.leads
  where created_at > now() - interval '5 minutes'
    and lower(email) = lower(trim(coalesce(p_email, '')))
    and phone = trim(coalesce(p_phone, ''))
  order by created_at desc
  limit 1;

  if existing_id is not null then
    return existing_id;
  end if;

  insert into public.leads (
    lead_type, full_name, email, phone, interest, preferred_time, note,
    source_path, marketing_consent, consent_at
  ) values (
    p_lead_type,
    left(trim(coalesce(p_full_name, '')), 120),
    lower(trim(coalesce(p_email, ''))),
    left(trim(coalesce(p_phone, '')), 30),
    left(trim(coalesce(p_interest, 'Tư vấn chung')), 120),
    left(trim(coalesce(p_preferred_time, '')), 120),
    left(trim(coalesce(p_note, '')), 2000),
    left(trim(coalesce(p_source_path, '')), 300),
    coalesce(p_marketing_consent, false),
    now()
  ) returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.admin_update_lead_status(
  p_lead_id uuid,
  p_status public.lead_status
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_row jsonb;
  new_row jsonb;
begin
  if not public.is_admin() then raise insufficient_privilege; end if;
  select to_jsonb(l) into old_row from public.leads l where id = p_lead_id for update;
  if old_row is null then raise exception 'lead not found'; end if;
  update public.leads set status = p_status where id = p_lead_id returning to_jsonb(leads.*) into new_row;
  insert into public.admin_audit_logs (admin_id, action, target_table, target_id, old_value, new_value)
  values ((select auth.uid()), 'lead.status.updated', 'leads', p_lead_id::text, old_row, new_row);
end;
$$;

create or replace function public.admin_update_class_session(
  p_session_id text,
  p_status public.session_status,
  p_capacity integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_row jsonb;
  new_row jsonb;
  confirmed_count integer;
begin
  if not public.is_admin() then raise insufficient_privilege; end if;
  if p_capacity < 1 or p_capacity > 500 then raise exception 'invalid capacity'; end if;
  select count(*) into confirmed_count from public.bookings
  where session_id = p_session_id and status in ('confirmed', 'attended');
  if p_capacity < confirmed_count then raise exception 'capacity below confirmed bookings'; end if;
  select to_jsonb(s) into old_row from public.class_sessions s where id = p_session_id for update;
  if old_row is null then raise exception 'session not found'; end if;
  update public.class_sessions set status = p_status, capacity = p_capacity
  where id = p_session_id returning to_jsonb(class_sessions.*) into new_row;
  insert into public.admin_audit_logs (admin_id, action, target_table, target_id, old_value, new_value)
  values ((select auth.uid()), 'class_session.updated', 'class_sessions', p_session_id, old_row, new_row);
end;
$$;

create or replace function public.admin_save_blog_post(
  p_id uuid,
  p_slug text,
  p_category text,
  p_title text,
  p_excerpt text,
  p_content text,
  p_hero_image_path text,
  p_author_name text,
  p_status public.post_status
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  post_id uuid := coalesce(p_id, gen_random_uuid());
  old_row jsonb;
  new_row jsonb;
begin
  if not public.is_admin() then raise insufficient_privilege; end if;
  if p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'invalid slug'; end if;
  if p_hero_image_path !~ '^/assets/images/[a-zA-Z0-9_./-]+$' then raise exception 'invalid image path'; end if;
  select to_jsonb(p) into old_row from public.blog_posts p where id = post_id for update;

  insert into public.blog_posts (
    id, slug, category, title, excerpt, content, hero_image_path,
    author_name, status, published_at
  ) values (
    post_id, p_slug, p_category, p_title, p_excerpt, p_content,
    p_hero_image_path, p_author_name, p_status,
    case when p_status = 'published' then now() else null end
  )
  on conflict (id) do update set
    slug = excluded.slug,
    category = excluded.category,
    title = excluded.title,
    excerpt = excluded.excerpt,
    content = excluded.content,
    hero_image_path = excluded.hero_image_path,
    author_name = excluded.author_name,
    status = excluded.status,
    published_at = case
      when excluded.status = 'published' then coalesce(public.blog_posts.published_at, now())
      else null
    end
  returning to_jsonb(blog_posts.*) into new_row;

  insert into public.admin_audit_logs (admin_id, action, target_table, target_id, old_value, new_value)
  values ((select auth.uid()), 'blog_post.saved', 'blog_posts', post_id::text, old_row, new_row);
  return post_id;
end;
$$;

create or replace function public.admin_kpis()
returns table (
  new_leads_30d bigint,
  conversion_rate numeric,
  bookings_30d bigint,
  average_occupancy numeric
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.leads where created_at >= now() - interval '30 days' and status = 'new'),
    coalesce((
      select round(100.0 * count(*) filter (where status = 'closed') / nullif(count(*) filter (where status <> 'spam'), 0), 1)
      from public.leads where created_at >= now() - interval '30 days'
    ), 0),
    (select count(*) from public.bookings where created_at >= now() - interval '30 days' and status <> 'cancelled'),
    coalesce((
      select round(avg(least(100.0, 100.0 * confirmed / capacity)), 1)
      from (
        select s.id, s.capacity, count(b.id) filter (where b.status in ('confirmed', 'attended')) as confirmed
        from public.class_sessions s
        left join public.bookings b on b.session_id = s.id
        where s.starts_at >= now() - interval '30 days'
        group by s.id, s.capacity
      ) occupancy
    ), 0)
  where public.is_admin();
$$;

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.coaches enable row level security;
alter table public.class_sessions enable row level security;
alter table public.bookings enable row level security;
alter table public.blog_posts enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy profiles_self_or_admin_select on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_admin());
create policy profiles_self_update on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy leads_admin_select on public.leads for select to authenticated using (public.is_admin());
create policy coaches_public_select on public.coaches for select to anon, authenticated using (is_active or public.is_admin());
create policy sessions_public_select on public.class_sessions for select to anon, authenticated using (true);
create policy bookings_owner_or_admin_select on public.bookings for select to authenticated
using (user_id = (select auth.uid()) or public.is_admin());
create policy blog_public_or_admin_select on public.blog_posts for select to anon, authenticated
using (status = 'published' or public.is_admin());
create policy audit_admin_select on public.admin_audit_logs for select to authenticated using (public.is_admin());

revoke all on all tables in schema public from anon, authenticated;
grant select on public.coaches, public.class_sessions, public.blog_posts to anon;
grant select on public.profiles, public.leads, public.coaches, public.class_sessions,
  public.bookings, public.blog_posts, public.admin_audit_logs to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

revoke all on function public.submit_lead(text,text,text,text,text,text,text,text,boolean) from public;
grant execute on function public.submit_lead(text,text,text,text,text,text,text,text,boolean) to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.admin_update_lead_status(uuid,public.lead_status) to authenticated;
grant execute on function public.admin_update_class_session(text,public.session_status,integer) to authenticated;
grant execute on function public.admin_save_blog_post(uuid,text,text,text,text,text,text,text,public.post_status) to authenticated;
grant execute on function public.admin_kpis() to authenticated;

revoke all on function public.admin_update_lead_status(uuid,public.lead_status) from anon;
revoke all on function public.admin_update_class_session(text,public.session_status,integer) from anon;
revoke all on function public.admin_save_blog_post(uuid,text,text,text,text,text,text,text,public.post_status) from anon;
revoke all on function public.admin_kpis() from anon;

