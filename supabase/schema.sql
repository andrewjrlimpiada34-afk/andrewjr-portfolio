-- Run this entire file once in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  type text not null,
  image_url text not null,
  demo_url text,
  tone text not null default 'blue' check (tone in ('blue', 'lime', 'lilac', 'peach')),
  background text not null,
  solution text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('skill', 'techstack')),
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 5 and 160),
  message text not null check (char_length(message) between 5 and 2000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.feedback enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects for select using (true);

drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills" on public.skills for select using (true);

drop policy if exists "Admin manages projects" on public.projects;
create policy "Admin manages projects" on public.projects for all to authenticated
using ((auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com')
with check ((auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com');

drop policy if exists "Admin manages skills" on public.skills;
create policy "Admin manages skills" on public.skills for all to authenticated
using ((auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com')
with check ((auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com');

drop policy if exists "Anyone can send feedback" on public.feedback;
create policy "Anyone can send feedback" on public.feedback for insert to anon, authenticated
with check (status = 'new');

drop policy if exists "Admin reads feedback" on public.feedback;
create policy "Admin reads feedback" on public.feedback for select to authenticated
using ((auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com');

drop policy if exists "Admin updates feedback" on public.feedback;
create policy "Admin updates feedback" on public.feedback for update to authenticated
using ((auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com')
with check ((auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com');

drop policy if exists "Admin deletes feedback" on public.feedback;
create policy "Admin deletes feedback" on public.feedback for delete to authenticated
using ((auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com');

insert into storage.buckets (id, name, public)
values ('portfolio-projects', 'portfolio-projects', true)
on conflict (id) do update set public = true;

drop policy if exists "Public reads project images" on storage.objects;
create policy "Public reads project images" on storage.objects for select
using (bucket_id = 'portfolio-projects');

drop policy if exists "Admin uploads project images" on storage.objects;
create policy "Admin uploads project images" on storage.objects for insert to authenticated
with check (
  bucket_id = 'portfolio-projects'
  and (auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com'
);

drop policy if exists "Admin updates project images" on storage.objects;
create policy "Admin updates project images" on storage.objects for update to authenticated
using (
  bucket_id = 'portfolio-projects'
  and (auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com'
);

drop policy if exists "Admin deletes project images" on storage.objects;
create policy "Admin deletes project images" on storage.objects for delete to authenticated
using (
  bucket_id = 'portfolio-projects'
  and (auth.jwt() ->> 'email') = 'andrewjrlimpiada34@gmail.com'
);

insert into public.projects (number, title, type, image_url, tone, background, solution, sort_order)
select * from (values
  ('01', 'LabCab Kiosk', 'Kiosk Application', '/projects/labcabkiosk.png', 'blue', 'A smart laboratory cabinet interface designed to simplify equipment registration, borrowing, and returns.', 'A clear, task-first kiosk experience with oversized actions, status visibility, and an interface built for quick use in the lab.', 1),
  ('02', 'LabCab Web App', 'Web Application', '/projects/labcabwebapp.png', 'lime', 'An administrative dashboard for monitoring laboratory assets, borrowers, stock alerts, and system health.', 'A focused command hub that brings real-time activity and inventory data into one structured, easy-to-scan workspace.', 2),
  ('03', 'Cooking Ina', 'Community Platform', '/projects/recipe.png', 'lilac', 'A community cooking platform where people can document food memories, discover recipes, and share their own dishes.', 'A warm, approachable dashboard that organizes discovery, diary entries, saved recipes, and profiles around visual storytelling.', 3),
  ('04', 'Severino', 'E-commerce Website', '/projects/severino.png', 'peach', 'A refined online storefront for a fragrance collection inspired by the visual language of premium lifestyle brands.', 'An editorial shopping experience with strong typography, elegant spacing, and product-focused browsing that feels calm and luxurious.', 4)
) as seed(number, title, type, image_url, tone, background, solution, sort_order)
where not exists (select 1 from public.projects);

insert into public.skills (name, category, sort_order)
select * from (values
  ('Website Development', 'skill', 1),
  ('Frontend Development', 'skill', 2),
  ('UI / UX Design', 'skill', 3),
  ('Responsive Interfaces', 'skill', 4),
  ('Design Prototyping', 'skill', 5),
  ('Software Engineering', 'skill', 6),
  ('React', 'techstack', 1),
  ('JavaScript', 'techstack', 2),
  ('HTML', 'techstack', 3),
  ('CSS', 'techstack', 4),
  ('Vite', 'techstack', 5),
  ('Git', 'techstack', 6),
  ('Responsive Design', 'techstack', 7),
  ('UI / UX', 'techstack', 8)
) as seed(name, category, sort_order)
where not exists (select 1 from public.skills);
