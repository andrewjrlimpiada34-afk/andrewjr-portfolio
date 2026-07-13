-- Run once in Supabase SQL Editor for an existing portfolio database.
alter table public.skills drop constraint if exists skills_category_check;

update public.skills
set category = case
  when category = 'service' then 'skill'
  when category = 'technology' then 'techstack'
  else category
end;

alter table public.skills
  add constraint skills_category_check
  check (category in ('skill', 'techstack'));

alter table public.skills
  add column if not exists image_url text;
