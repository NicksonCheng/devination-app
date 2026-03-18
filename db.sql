/* this is the code for creating history record table*/
create table public.quiz_history
(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_type text not null,
  result_data jsonb not null,
  created_at timestamptz not null default now()
);

create index quiz_history_user_id_idx on public.quiz_history(user_id);

alter table public.quiz_history enable row level security;

create policy "Users can insert own history"
  on public.quiz_history for
insert
  with check (auth.uid() =
user_id);

create policy "Users can read own history"
  on public.quiz_history for
select
  using (auth.uid() = user_id);



/* create user payment table */
create table public.orders
(
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  user_id uuid references auth.users(id),
  items jsonb not null,
  total_amount integer not null,
  status text not null default 'pending',
  ecpay_trade_no text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);