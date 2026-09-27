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


/* ------------------------------------------------------------------ */
/*  調香師後台（super account）                                          */
/* ------------------------------------------------------------------ */

/* 後台管理員名單：把調香師的帳號加進來
   insert into public.admin_users (user_id)
   select id from auth.users where email = '調香師的 email';
*/
create table public.admin_users
(
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Users can see if they are admin"
  on public.admin_users for
select
  using (auth.uid() = user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;


/* 可編輯的網站內容（對應 src/data/*.json 與連結），沒有資料時程式會使用 JSON 預設值 */
create table public.site_content
(
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.site_content enable row level security;

create policy "Anyone can read site content"
  on public.site_content for
select
  using (true);

create policy "Admins can insert site content"
  on public.site_content for
insert
  with check (public.is_admin());

create policy "Admins can update site content"
  on public.site_content for
update
  using (public.is_admin());

create policy "Admins can delete site content"
  on public.site_content for
delete
  using (public.is_admin());


/* 流年香氣密碼：只存 bcrypt 雜湊，沒有任何 policy，只能透過下方函式存取 */
create table public.site_secrets
(
  key text primary key,
  password_hash text not null,
  access_token text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_secrets enable row level security;

-- 密碼正確時回傳 access token（寫入客人的 cookie），錯誤回傳 null
create or replace function public.verify_numerology_password(p_password text)
returns text
language sql
stable
security definer
set search_path = public, extensions
as $$
  select access_token from public.site_secrets
  where key = 'numerology'
    and password_hash = extensions.crypt(p_password, password_hash);
$$;

create or replace function public.check_numerology_token(p_token text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.site_secrets
    where key = 'numerology' and access_token = p_token
  );
$$;

create or replace function public.has_numerology_password()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.site_secrets where key = 'numerology');
$$;

-- 只有管理員可以改密碼；改密碼會換新 token，讓舊 cookie 全部失效
create or replace function public.set_numerology_password(p_password text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if length(coalesce(p_password, '')) < 4 then
    raise exception 'password too short';
  end if;

  insert into public.site_secrets (key, password_hash, access_token, updated_at)
  values (
    'numerology',
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    gen_random_uuid()::text,
    now()
  )
  on conflict (key) do update
    set password_hash = excluded.password_hash,
        access_token = excluded.access_token,
        updated_at = now();
end;
$$;

revoke execute on function public.set_numerology_password(text) from anon;
