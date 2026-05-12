create extension if not exists pgcrypto;

create table if not exists news_articles (
  id uuid primary key default gen_random_uuid(),

  external_id text,
  title text not null,
  title_normalized text,

  summary text,
  content_excerpt text,

  url text not null unique,
  image_url text,

  published_at timestamptz,
  language text,
  country text default 'br',
  category text default 'sports',

  source_id text,
  source_name text,
  source_url text,
  source_country text,

  search_query text,
  endpoint text default 'search',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_news_articles_published_at
on news_articles (published_at desc);

create index if not exists idx_news_articles_category
on news_articles (category);

create index if not exists idx_news_articles_source_name
on news_articles (source_name);

create index if not exists idx_news_articles_title_normalized
on news_articles (title_normalized);

create table if not exists gnews_fetch_logs (
  id uuid primary key default gen_random_uuid(),

  endpoint text default 'search',
  query text not null,
  status text not null,

  total_articles_api integer default 0,
  articles_received integer default 0,
  articles_saved integer default 0,
  articles_skipped integer default 0,

  error_message text,

  created_at timestamptz default now()
);

