alter table public.welcome_posts
    add column if not exists map_embed_url text;
