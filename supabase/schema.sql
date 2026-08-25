-- ============================================================
-- NEXT FRAME — Supabase schema
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)
-- ============================================================

-- ---------- PROFILES ----------
-- One row per authenticated user, auto-created on signup.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- PROJECTS ----------
-- Client project submissions (LAUNCH / HERO / ENGINE requests, or free text).
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text,               -- e.g. LAUNCH / HERO / ENGINE / other
  budget text,
  deadline date,
  status text not null default 'submitted',
  -- submitted -> reviewing -> in_production -> qa -> delivered -> archived
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table projects enable row level security;

create policy "Users can view their own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Admins can view all projects"
  on projects for select
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

create policy "Users can create their own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Admins can update any project"
  on projects for update
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- ---------- PROJECT UPDATES ----------
-- Timeline of status/progress notes attached to a project (posted by admin).
create table if not exists project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  message text not null,
  status text,                 -- optional: status the project moved to
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

alter table project_updates enable row level security;

create policy "Owner or admin can view project updates"
  on project_updates for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_updates.project_id
      and (projects.user_id = auth.uid()
           or exists (select 1 from profiles where id = auth.uid() and is_admin = true))
    )
  );

create policy "Admins can insert project updates"
  on project_updates for insert
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- ---------- COMMUNITY POSTS ----------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  image_url text,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone"
  on posts for select
  using (true);

create policy "Users can create their own posts"
  on posts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on posts for delete
  using (auth.uid() = user_id);

-- ---------- LIKES ----------
create table if not exists post_likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table post_likes enable row level security;

create policy "Likes are viewable by everyone"
  on post_likes for select
  using (true);

create policy "Users can like as themselves"
  on post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike their own like"
  on post_likes for delete
  using (auth.uid() = user_id);

-- ---------- COMMENTS ----------
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

create policy "Users can comment as themselves"
  on comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on comments for delete
  using (auth.uid() = user_id);

-- ---------- FOLLOWS ----------
create table if not exists follows (
  follower_id uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

alter table follows enable row level security;

create policy "Follows are viewable by everyone"
  on follows for select
  using (true);

create policy "Users can follow as themselves"
  on follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow as themselves"
  on follows for delete
  using (auth.uid() = follower_id);

-- ---------- DIRECT / CHAT MESSAGES ----------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id) on delete cascade,
  receiver_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

alter table messages enable row level security;

create policy "Users can view their own conversations"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages as themselves"
  on messages for insert
  with check (auth.uid() = sender_id);

-- ---------- INDEXES ----------
create index if not exists idx_projects_user on projects(user_id);
create index if not exists idx_posts_user on posts(user_id);
create index if not exists idx_posts_created on posts(created_at desc);
create index if not exists idx_follows_follower on follows(follower_id);
create index if not exists idx_follows_following on follows(following_id);
create index if not exists idx_messages_conversation on messages(sender_id, receiver_id, created_at);

-- ============================================================
-- To make yourself an admin (after signing up once through the app),
-- run this in the SQL editor with your own email:
--
--   update profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================
