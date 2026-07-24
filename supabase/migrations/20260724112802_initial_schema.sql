create extension if not exists pgcrypto with schema extensions;

create type public.access_status as enum (
  'pending',
  'active',
  'suspended'
);

create type public.order_status as enum (
  'quote',
  'awaiting_payment',
  'confirmed',
  'in_production',
  'ready',
  'delivered',
  'canceled'
);

create type public.payment_status as enum (
  'unpaid',
  'partially_paid',
  'paid'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  atelier_name text,
  whatsapp text,
  access_status public.access_status not null default 'pending',
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  minimum_price_multiplier numeric(8, 3) not null default 1.500,
  recommended_price_multiplier numeric(8, 3) not null default 2.000,
  currency_code text not null default 'BRL',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint minimum_multiplier_positive
    check (minimum_price_multiplier > 0),
  constraint recommended_multiplier_valid
    check (recommended_price_multiplier >= minimum_price_multiplier),
  constraint currency_code_brl_only
    check (currency_code = 'BRL')
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  description text,
  sale_unit text not null default 'unidade',
  batch_yield integer not null,
  packaging_cost_per_unit_cents bigint not null default 0,
  additional_batch_cost_cents bigint not null default 0,
  material_cost_batch_cents bigint not null default 0,
  packaging_cost_batch_cents bigint not null default 0,
  total_cost_batch_cents bigint not null default 0,
  unit_cost_cents bigint not null default 0,
  minimum_price_cents bigint not null default 0,
  recommended_price_cents bigint not null default 0,
  selling_price_cents bigint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_name_not_blank
    check (char_length(trim(name)) > 0),
  constraint products_sale_unit_not_blank
    check (char_length(trim(sale_unit)) > 0),
  constraint products_batch_yield_positive
    check (batch_yield > 0),
  constraint products_non_negative_money
    check (
      packaging_cost_per_unit_cents >= 0
      and additional_batch_cost_cents >= 0
      and material_cost_batch_cents >= 0
      and packaging_cost_batch_cents >= 0
      and total_cost_batch_cents >= 0
      and unit_cost_cents >= 0
      and minimum_price_cents >= 0
      and recommended_price_cents >= 0
      and selling_price_cents >= 0
    ),
  constraint products_user_id_id_unique unique (user_id, id)
);

create table public.product_cost_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null,
  name text not null,
  unit_measure text not null,
  purchase_quantity numeric(14, 4) not null,
  purchase_price_cents bigint not null,
  used_quantity numeric(14, 4) not null,
  calculated_cost_cents bigint not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_cost_items_product_owner_fk
    foreign key (user_id, product_id)
    references public.products(user_id, id)
    on delete cascade,
  constraint cost_item_name_not_blank
    check (char_length(trim(name)) > 0),
  constraint cost_item_unit_measure_not_blank
    check (char_length(trim(unit_measure)) > 0),
  constraint cost_item_quantities_positive
    check (purchase_quantity > 0 and used_quantity > 0),
  constraint cost_item_money_non_negative
    check (purchase_price_cents >= 0 and calculated_cost_cents >= 0)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  whatsapp text,
  instagram text,
  city text,
  birthday date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_name_not_blank
    check (char_length(trim(name)) > 0),
  constraint customers_user_id_id_unique unique (user_id, id)
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid,
  order_date date not null,
  delivery_date date,
  status public.order_status not null default 'confirmed',
  payment_status public.payment_status not null default 'unpaid',
  payment_method text,
  subtotal_cents bigint not null default 0,
  discount_cents bigint not null default 0,
  delivery_fee_cents bigint not null default 0,
  total_cents bigint not null default 0,
  estimated_cost_cents bigint not null default 0,
  estimated_profit_cents bigint not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_customer_owner_fk
    foreign key (user_id, customer_id)
    references public.customers(user_id, id)
    on delete set null (customer_id),
  constraint sales_money_non_negative
    check (
      subtotal_cents >= 0
      and discount_cents >= 0
      and delivery_fee_cents >= 0
      and total_cents >= 0
      and estimated_cost_cents >= 0
    ),
  constraint sales_delivery_not_before_order
    check (delivery_date is null or delivery_date >= order_date),
  constraint sales_user_id_id_unique unique (user_id, id)
);

create table public.sale_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sale_id uuid not null,
  product_id uuid,
  product_name_snapshot text not null,
  sale_unit_snapshot text not null,
  quantity integer not null,
  unit_price_cents bigint not null,
  unit_cost_snapshot_cents bigint not null,
  minimum_price_snapshot_cents bigint not null,
  recommended_price_snapshot_cents bigint not null,
  subtotal_cents bigint not null,
  estimated_cost_cents bigint not null,
  estimated_profit_cents bigint not null,
  created_at timestamptz not null default now(),
  constraint sale_items_sale_owner_fk
    foreign key (user_id, sale_id)
    references public.sales(user_id, id)
    on delete cascade,
  constraint sale_items_product_owner_fk
    foreign key (user_id, product_id)
    references public.products(user_id, id)
    on delete set null (product_id),
  constraint sale_items_product_name_snapshot_not_blank
    check (char_length(trim(product_name_snapshot)) > 0),
  constraint sale_items_sale_unit_snapshot_not_blank
    check (char_length(trim(sale_unit_snapshot)) > 0),
  constraint sale_items_quantity_positive
    check (quantity > 0),
  constraint sale_items_money_non_negative
    check (
      unit_price_cents >= 0
      and unit_cost_snapshot_cents >= 0
      and minimum_price_snapshot_cents >= 0
      and recommended_price_snapshot_cents >= 0
      and subtotal_cents >= 0
      and estimated_cost_cents >= 0
    )
);

create index products_user_id_idx on public.products(user_id);
create index products_user_active_idx on public.products(user_id, is_active);
create index product_cost_items_product_idx on public.product_cost_items(product_id);
create index product_cost_items_user_idx on public.product_cost_items(user_id);
create index customers_user_id_idx on public.customers(user_id);
create index customers_user_name_idx on public.customers(user_id, name);
create index sales_user_id_idx on public.sales(user_id);
create index sales_user_status_idx on public.sales(user_id, status);
create index sales_user_delivery_idx on public.sales(user_id, delivery_date);
create index sales_customer_idx on public.sales(customer_id);
create index sale_items_sale_idx on public.sale_items(sale_id);
create index sale_items_product_idx on public.sale_items(product_id);
create index sale_items_user_idx on public.sale_items(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger product_cost_items_set_updated_at
before update on public.product_cost_items
for each row execute function public.set_updated_at();

create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger sales_set_updated_at
before update on public.sales
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on
  public.profiles,
  public.user_settings,
  public.products,
  public.product_cost_items,
  public.customers,
  public.sales,
  public.sale_items
to authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.products enable row level security;
alter table public.product_cost_items enable row level security;
alter table public.customers enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "profiles_delete_own"
on public.profiles for delete
to authenticated
using ((select auth.uid()) = id);

create policy "user_settings_select_own"
on public.user_settings for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "user_settings_insert_own"
on public.user_settings for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "user_settings_update_own"
on public.user_settings for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "user_settings_delete_own"
on public.user_settings for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "products_select_own"
on public.products for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "products_insert_own"
on public.products for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "products_update_own"
on public.products for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "products_delete_own"
on public.products for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "product_cost_items_select_own"
on public.product_cost_items for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "product_cost_items_insert_own"
on public.product_cost_items for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "product_cost_items_update_own"
on public.product_cost_items for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "product_cost_items_delete_own"
on public.product_cost_items for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "customers_select_own"
on public.customers for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "customers_insert_own"
on public.customers for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "customers_update_own"
on public.customers for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "customers_delete_own"
on public.customers for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "sales_select_own"
on public.sales for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "sales_insert_own"
on public.sales for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "sales_update_own"
on public.sales for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "sales_delete_own"
on public.sales for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "sale_items_select_own"
on public.sale_items for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "sale_items_insert_own"
on public.sale_items for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "sale_items_update_own"
on public.sale_items for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "sale_items_delete_own"
on public.sale_items for delete
to authenticated
using ((select auth.uid()) = user_id);
