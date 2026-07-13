-- Run once in Supabase SQL Editor for an existing portfolio database.
alter table public.projects
  add column if not exists demo_url text;
