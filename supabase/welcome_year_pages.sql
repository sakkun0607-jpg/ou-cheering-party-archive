create table if not exists public.welcome_year_pages (
    id uuid primary key default gen_random_uuid(),
    year smallint not null unique check (year between 2000 and 2100),
    title text not null,
    intro text,
    blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array'),
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.welcome_year_pages enable row level security;
revoke insert, update, delete on public.welcome_year_pages from anon, authenticated;
grant select on public.welcome_year_pages to anon, authenticated;
grant insert, update, delete on public.welcome_year_pages to authenticated;

drop policy if exists "welcome_year_pages_public_read" on public.welcome_year_pages;
create policy "welcome_year_pages_public_read"
on public.welcome_year_pages
for select
to anon, authenticated
using (
    is_published = true
    or exists (
        select 1 from public.site_admins
        where site_admins.user_id = auth.uid()
    )
);

drop policy if exists "welcome_year_pages_admin_insert" on public.welcome_year_pages;
create policy "welcome_year_pages_admin_insert"
on public.welcome_year_pages
for insert
to authenticated
with check (
    exists (
        select 1 from public.site_admins
        where site_admins.user_id = auth.uid()
    )
);

drop policy if exists "welcome_year_pages_admin_update" on public.welcome_year_pages;
create policy "welcome_year_pages_admin_update"
on public.welcome_year_pages
for update
to authenticated
using (
    exists (
        select 1 from public.site_admins
        where site_admins.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1 from public.site_admins
        where site_admins.user_id = auth.uid()
    )
);

drop policy if exists "welcome_year_pages_admin_delete" on public.welcome_year_pages;
create policy "welcome_year_pages_admin_delete"
on public.welcome_year_pages
for delete
to authenticated
using (
    exists (
        select 1 from public.site_admins
        where site_admins.user_id = auth.uid()
    )
);

create index if not exists welcome_year_pages_year_idx
    on public.welcome_year_pages (year desc);
