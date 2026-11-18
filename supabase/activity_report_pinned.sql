alter table public.activity_reports
    add column if not exists is_pinned boolean not null default false;

create index if not exists activity_reports_pinned_created_idx
    on public.activity_reports (is_pinned desc, created_at desc);
