-- ============================================
-- CrushMe — Schéma Supabase
-- Exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- Table des profils utilisateurs
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  age_verified boolean default false,
  free_analysis_used boolean default false,
  created_at timestamptz default now()
);

-- Table des abonnements
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade unique not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text default 'incomplete' check (status in ('active', 'trialing', 'canceled', 'past_due', 'incomplete')),
  plan text default 'trial' check (plan in ('trial', 'monthly')),
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Table des analyses (sans images !)
create table if not exists public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  score integer not null check (score >= 0 and score <= 10),
  explanation text not null,
  conversation_text text,
  suggestions jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Table de limites d'usage quotidien
create table if not exists public.usage_limits (
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  count integer default 0,
  primary key (user_id, date)
);

-- Index pour les requêtes fréquentes
create index if not exists idx_analyses_user_id on public.analyses(user_id);
create index if not exists idx_analyses_created_at on public.analyses(created_at desc);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);
create index if not exists idx_usage_limits_date on public.usage_limits(user_id, date);

-- RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.analyses enable row level security;
alter table public.usage_limits enable row level security;

-- Policies: chaque utilisateur ne voit que ses données
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can view own usage"
  on public.usage_limits for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.usage_limits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.usage_limits for update
  using (auth.uid() = user_id);

-- Trigger pour créer un profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
