-- ShelterConnect Database Schema
-- Run this in the Supabase SQL editor (https://supabase.com/dashboard)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────────────────────
-- Mirrors auth.users; created automatically on sign-up via trigger below.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text,
  photo_url   text,
  role        text check (role in ('owner', 'shelter')),
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Trigger: auto-create profile row on auth sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, name, photo_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── owner_preferences ───────────────────────────────────────────────────────
create table if not exists public.owner_preferences (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  pet_type         text,
  size             text,
  has_young_kids   text,
  other_pets       text,
  activity_level   text,
  living_situation text,
  daily_time       text,
  experience       text,
  shedding         text,
  age_preference   text,
  updated_at       timestamptz default now(),
  unique (user_id)
);

alter table public.owner_preferences enable row level security;

create policy "Owners can manage their preferences"
  on public.owner_preferences for all using (auth.uid() = user_id);

-- ─── shelters ─────────────────────────────────────────────────────────────────
create table if not exists public.shelters (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  name                  text not null,
  phone                 text,
  address               text,
  about                 text,
  hours                 text,
  animal_types          text[] default '{}',
  adoption_fee          text,
  requires_home_visit   text,
  vaccination_policy    text,
  photo_url             text,
  created_at            timestamptz default now(),
  unique (user_id)
);

alter table public.shelters enable row level security;

create policy "Anyone can view shelters"
  on public.shelters for select using (true);

create policy "Shelter owners can manage their shelter"
  on public.shelters for all using (auth.uid() = user_id);

-- ─── pets ─────────────────────────────────────────────────────────────────────
create table if not exists public.pets (
  id               uuid primary key default uuid_generate_v4(),
  shelter_id       uuid not null references public.shelters(id) on delete cascade,
  name             text not null,
  breed            text,
  type             text not null check (type in ('dog', 'cat')),
  size             text check (size in ('small', 'medium', 'large')),
  age              text check (age in ('young', 'adult', 'senior')),
  age_display      text,
  energy_level     text check (energy_level in ('low', 'medium', 'high')),
  good_with_kids   boolean default false,
  good_with_pets   boolean default false,
  hypoallergenic   boolean default false,
  needs_yard       boolean default false,
  bio              text,
  available        boolean default true,
  created_at       timestamptz default now()
);

alter table public.pets enable row level security;

create policy "Anyone can view available pets"
  on public.pets for select using (available = true);

create policy "Shelter staff can manage their pets"
  on public.pets for all using (
    auth.uid() = (select user_id from public.shelters where id = shelter_id)
  );

-- Index for efficient filtering
create index if not exists pets_type_idx        on public.pets(type);
create index if not exists pets_size_idx        on public.pets(size);
create index if not exists pets_age_idx         on public.pets(age);
create index if not exists pets_energy_idx      on public.pets(energy_level);
create index if not exists pets_shelter_idx     on public.pets(shelter_id);
create index if not exists pets_available_idx   on public.pets(available);

-- ─── pet_media ────────────────────────────────────────────────────────────────
create table if not exists public.pet_media (
  id         uuid primary key default uuid_generate_v4(),
  pet_id     uuid not null references public.pets(id) on delete cascade,
  type       text not null check (type in ('image', 'video')),
  url        text not null,
  sort_order int default 0
);

alter table public.pet_media enable row level security;

create policy "Anyone can view pet media"
  on public.pet_media for select using (true);

create policy "Shelter staff can manage pet media"
  on public.pet_media for all using (
    auth.uid() = (
      select s.user_id from public.shelters s
      join public.pets p on p.shelter_id = s.id
      where p.id = pet_id
    )
  );

create index if not exists pet_media_pet_idx on public.pet_media(pet_id);
