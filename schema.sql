-- PlayQZ MVP schema
create extension if not exists "pgcrypto";

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  district text,
  address text not null,
  description text,
  phone text,
  owner_user_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists pitches (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  name text not null,
  sport text not null default 'football',
  surface text,
  indoor boolean not null default false,
  players text,
  price_per_hour integer not null,
  image_url text,
  amenities jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists opening_hours (
  id uuid primary key default gen_random_uuid(),
  pitch_id uuid not null references pitches(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  open_time time not null,
  close_time time not null
);

create table if not exists price_rules (
  id uuid primary key default gen_random_uuid(),
  pitch_id uuid not null references pitches(id) on delete cascade,
  weekday smallint,
  start_time time,
  end_time time,
  price_per_hour integer not null
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  pitch_id uuid not null references pitches(id),
  user_id uuid,
  booking_date date not null,
  start_time time not null,
  end_time time,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected','cancelled','expired')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','refunded')),
  total_amount integer not null default 0,
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now()
);

create table if not exists venue_policies (
  venue_id uuid primary key references venues(id) on delete cascade,
  cancellation_hours integer not null default 24,
  no_show_limit integer not null default 3
);

create index if not exists bookings_pitch_date_idx on bookings(pitch_id, booking_date);
create index if not exists pitches_city_idx on pitches(sport, active);

-- IMPORTANT:
-- Before production, add Row Level Security policies.
-- Do not expose service-role keys in VITE_* variables.
-- Use server-side/Edge Function logic for privileged booking/payment operations.
