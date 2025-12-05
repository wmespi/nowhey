-- Create a table for public profiles
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  google_id text unique,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.users enable row level security;

create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);

create policy "Users can insert their own profile." on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.users
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, google_id, email, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'provider_id', -- Extract Google ID (provider_id is standard for OAuth)
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update reviews table to reference users
-- Note: You might need to drop existing reviews or handle migration if there are existing rows without user_id
-- For now, we add the column as nullable, but ideally it should be not null for new reviews
alter table public.reviews 
add column if not exists user_id uuid references public.users(id);

-- Optional: Add RLS to reviews
alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone." on public.reviews
  for select using (true);

create policy "Users can insert their own reviews." on public.reviews
  for insert with check (auth.uid() = user_id);

-- Only allow users to update/delete their own reviews
create policy "Users can update their own reviews." on public.reviews
  for update using (auth.uid() = user_id);

create policy "Users can delete their own reviews." on public.reviews
  for delete using (auth.uid() = user_id);
