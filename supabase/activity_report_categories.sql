alter table public.activity_reports
    add column if not exists category text not null default '演舞演奏会',
    add column if not exists tags text[] not null default '{}';

create index if not exists activity_reports_category_idx
    on public.activity_reports (category);

create index if not exists activity_reports_tags_idx
    on public.activity_reports using gin (tags);
