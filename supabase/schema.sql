-- ============================================
-- HeartQuest Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PLAYERS TABLE
-- ============================================

create table if not exists public.players (
  id uuid references auth.users(id) on delete cascade primary key,
  
  -- Basic info
  display_name text not null default 'Adventurer',
  avatar text not null default '🧙',
  
  -- Progression
  level integer not null default 1,
  xp integer not null default 0,
  xp_to_next_level integer not null default 100,
  
  -- Currency
  gold integer not null default 50,
  gems integer not null default 0,
  
  -- Stats (stored as JSONB)
  stats jsonb not null default '{
    "health": 100,
    "maxHealth": 100,
    "attack": 10,
    "defense": 5,
    "speed": 10,
    "luck": 5,
    "charisma": 5,
    "detection": 10
  }'::jsonb,
  
  -- Equipment (stored as JSONB)
  equipped_items jsonb not null default '{}'::jsonb,
  
  -- Dating profile (optional)
  profile jsonb,
  
  -- Location (optional)
  location jsonb,
  
  -- Rival relationships
  rivals jsonb not null default '[]'::jsonb,
  
  -- Stats
  monsters_killed integer not null default 0,
  players_defeated integer not null default 0,
  items_found integer not null default 0,
  
  -- Founder status
  is_founder boolean not null default false,
  founder_tier text,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active timestamptz not null default now()
);

-- ============================================
-- INVENTORY TABLE
-- ============================================

create table if not exists public.inventory (
  id bigserial primary key,
  player_id uuid references public.players(id) on delete cascade not null,
  item_id text not null,
  quantity integer not null default 1,
  equipped_slot text,
  created_at timestamptz not null default now(),
  
  unique(player_id, item_id)
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

alter table public.players enable row level security;
alter table public.inventory enable row level security;

-- Players can only read/write their own data
create policy "Players can read own data"
  on public.players for select
  using (auth.uid() = id);

create policy "Players can insert own data"
  on public.players for insert
  with check (auth.uid() = id);

create policy "Players can update own data"
  on public.players for update
  using (auth.uid() = id);

-- Inventory policies
create policy "Players can read own inventory"
  on public.inventory for select
  using (auth.uid() = player_id);

create policy "Players can insert own inventory"
  on public.inventory for insert
  with check (auth.uid() = player_id);

create policy "Players can update own inventory"
  on public.inventory for update
  using (auth.uid() = player_id);

create policy "Players can delete own inventory"
  on public.inventory for delete
  using (auth.uid() = player_id);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists inventory_player_id_idx on public.inventory(player_id);
create index if not exists players_last_active_idx on public.players(last_active);

-- ============================================
-- FUNCTION TO UPDATE updated_at
-- ============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_players_updated_at
  before update on public.players
  for each row
  execute function public.handle_updated_at();

-- ============================================
-- DONE!
-- ============================================
-- After running this, copy your Supabase URL and anon key
-- and add them to your .env file:
-- EXPO_PUBLIC_SUPABASE_URL=your_url
-- EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
