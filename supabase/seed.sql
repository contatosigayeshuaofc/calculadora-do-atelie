insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'teste-a@calculadoradoatelie.local',
    crypt('Atelie123!', gen_salt('bf')),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Artesa Teste A"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'teste-b@calculadoradoatelie.local',
    crypt('Atelie123!', gen_salt('bf')),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Artesa Teste B"}'::jsonb,
    now(),
    now()
  )
on conflict (id) do nothing;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '{"sub":"00000000-0000-4000-8000-000000000001","email":"teste-a@calculadoradoatelie.local"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000002',
    '{"sub":"00000000-0000-4000-8000-000000000002","email":"teste-b@calculadoradoatelie.local"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider, provider_id) do nothing;

update public.profiles
set
  atelier_name = 'Atelie Lavanda',
  whatsapp = '11999990001',
  access_status = 'active',
  activated_at = now()
where id = '00000000-0000-4000-8000-000000000001';

update public.profiles
set
  atelier_name = 'Atelie Baunilha',
  whatsapp = '11999990002',
  access_status = 'active',
  activated_at = now()
where id = '00000000-0000-4000-8000-000000000002';

insert into public.products (
  id,
  user_id,
  name,
  category,
  sale_unit,
  batch_yield,
  packaging_cost_per_unit_cents,
  additional_batch_cost_cents,
  material_cost_batch_cents,
  packaging_cost_batch_cents,
  total_cost_batch_cents,
  unit_cost_cents,
  minimum_price_cents,
  recommended_price_cents,
  selling_price_cents
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    'Vela aromatica lavanda',
    'Velas',
    'unidade',
    10,
    250,
    500,
    12500,
    2500,
    15500,
    1550,
    2325,
    3100,
    3500
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000002',
    'Sabonete artesanal baunilha',
    'Sabonetes',
    'unidade',
    20,
    120,
    300,
    9400,
    2400,
    12100,
    605,
    908,
    1210,
    1500
  )
on conflict (id) do nothing;

insert into public.customers (id, user_id, name, whatsapp, city)
values
  (
    '20000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    'Cliente A',
    '11988880001',
    'Sao Paulo'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000002',
    'Cliente B',
    '11988880002',
    'Campinas'
  )
on conflict (id) do nothing;

insert into public.sales (
  id,
  user_id,
  customer_id,
  order_date,
  delivery_date,
  status,
  payment_status,
  subtotal_cents,
  discount_cents,
  delivery_fee_cents,
  total_cents,
  estimated_cost_cents,
  estimated_profit_cents
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    current_date,
    current_date + 7,
    'confirmed',
    'paid',
    7000,
    0,
    0,
    7000,
    3100,
    3900
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    current_date,
    current_date + 5,
    'in_production',
    'partially_paid',
    3000,
    0,
    0,
    3000,
    1210,
    1790
  )
on conflict (id) do nothing;

insert into public.sale_items (
  id,
  user_id,
  sale_id,
  product_id,
  product_name_snapshot,
  sale_unit_snapshot,
  quantity,
  unit_price_cents,
  unit_cost_snapshot_cents,
  minimum_price_snapshot_cents,
  recommended_price_snapshot_cents,
  subtotal_cents,
  estimated_cost_cents,
  estimated_profit_cents
)
values
  (
    '40000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'Vela aromatica lavanda',
    'unidade',
    2,
    3500,
    1550,
    2325,
    3100,
    7000,
    3100,
    3900
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'Sabonete artesanal baunilha',
    'unidade',
    2,
    1500,
    605,
    908,
    1210,
    3000,
    1210,
    1790
  )
on conflict (id) do nothing;
