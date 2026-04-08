-- ============================================================
--  BrainiacTennis — Supabase Schema
--  Paste this into Supabase > SQL Editor > New Query > Run
-- ============================================================

-- Coaches table
create table if not exists coaches (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  initials    text not null,
  role        text not null,
  bio         text,
  areas       text[] not null default '{}',
  active      boolean not null default true,
  created_at  timestamptz default now()
);

-- Availability table (weekly template per coach)
create table if not exists availability (
  id           uuid primary key default gen_random_uuid(),
  coach_id     uuid references coaches(id) on delete cascade,
  day_of_week  int not null check (day_of_week between 0 and 6),
  time_slot    text not null,   -- e.g. '09:00'
  is_open      boolean not null default true,
  unique (coach_id, day_of_week, time_slot)
);

-- Bookings table
create table if not exists bookings (
  id               uuid primary key default gen_random_uuid(),
  client_name      text not null,
  client_email     text not null,
  client_phone     text,
  coach_id         uuid references coaches(id),
  lesson_type      text not null check (lesson_type in ('private','group','match')),
  location         text not null,
  date             date not null,
  time_slot        text not null,
  skill_level      text not null check (skill_level in ('beginner','intermediate','advanced')),
  payment_method   text not null check (payment_method in ('online','in_person')),
  status           text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  notes            text,
  created_at       timestamptz default now()
);

-- ── Row-level security ────────────────────────────────────────
alter table coaches    enable row level security;
alter table availability enable row level security;
alter table bookings   enable row level security;

-- Public can read coaches and availability
create policy "coaches_public_read"    on coaches    for select using (true);
create policy "availability_public_read" on availability for select using (true);

-- Anyone can insert a booking (clients booking online)
create policy "bookings_insert"        on bookings   for insert with check (true);

-- Only service role (server) can update/delete bookings
create policy "bookings_service_update" on bookings  for update using (auth.role() = 'service_role');
create policy "bookings_service_delete" on bookings  for delete using (auth.role() = 'service_role');

-- Coaches can read all bookings (authenticated)
create policy "bookings_auth_read"     on bookings   for select using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- ── Seed coaches ──────────────────────────────────────────────
insert into coaches (name, initials, role, bio, areas) values
  ('Esther Forrester', 'EF', 'Head coach & founder',
   'Former Division I collegiate player with 20+ years of teaching experience. Coached the Empire State Games and Tennis Europe. Nationally ranked in the 30-and-over category.',
   array['NYC','DC','PHL']),
  ('Coach Marcus', 'MC', 'NYC instructor',
   'Junior development and group clinics specialist. Based in the NYC metro area.',
   array['NYC']),
  ('Coach Diana', 'DC', 'DC & suburbs',
   'Match coaching and strategy specialist. Covers greater DC and Maryland suburbs.',
   array['DC']),
  ('Coach Leo', 'LC', 'Philadelphia & suburbs',
   'Adult beginner specialist and group lesson instructor. Philadelphia metro area.',
   array['PHL']);

-- ── Seed availability (Mon–Sat, common slots) ─────────────────
-- day_of_week: 0=Mon 1=Tue 2=Wed 3=Thu 4=Fri 5=Sat 6=Sun
do $$
declare
  coach record;
  d int;
  t text;
  slots text[] := array['09:00','10:30','12:00','14:00','16:00','17:30'];
begin
  for coach in select id from coaches loop
    for d in 0..5 loop
      foreach t in array slots loop
        insert into availability (coach_id, day_of_week, time_slot, is_open)
        values (coach.id, d, t, true)
        on conflict do nothing;
      end loop;
    end loop;
  end loop;
end $$;
