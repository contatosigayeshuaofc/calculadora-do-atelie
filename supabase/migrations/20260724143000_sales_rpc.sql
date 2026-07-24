create or replace function public.create_sale_with_items(
  p_customer_id uuid,
  p_order_date date,
  p_delivery_date date,
  p_status public.order_status,
  p_payment_status public.payment_status,
  p_payment_method text,
  p_discount_cents bigint,
  p_delivery_fee_cents bigint,
  p_items jsonb,
  p_notes text
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_sale_id uuid;
  v_subtotal_cents bigint;
  v_estimated_cost_cents bigint;
  v_total_cents bigint;
begin
  if v_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  if p_delivery_date is not null and p_delivery_date < p_order_date then
    raise exception 'A entrega nao pode ser antes da data do pedido.';
  end if;

  if p_discount_cents < 0 then
    raise exception 'O desconto nao pode ser negativo.';
  end if;

  if p_delivery_fee_cents < 0 then
    raise exception 'A taxa de entrega nao pode ser negativa.';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Adicione pelo menos um produto a venda.';
  end if;

  if p_customer_id is not null and not exists (
    select 1
    from public.customers
    where id = p_customer_id
      and user_id = v_user_id
  ) then
    raise exception 'Cliente nao encontrado.';
  end if;

  create temporary table pg_temp.sale_snapshot_items on commit drop as
  with requested_items as (
    select
      item.product_id,
      item.quantity,
      item.unit_price_cents
    from jsonb_to_recordset(p_items) as item(
      product_id uuid,
      quantity integer,
      unit_price_cents bigint
    )
  ),
  snapshot_items as (
    select
      product.id as product_id,
      product.name,
      product.sale_unit,
      requested_items.quantity,
      requested_items.unit_price_cents,
      product.unit_cost_cents,
      product.minimum_price_cents,
      product.recommended_price_cents,
      (requested_items.unit_price_cents * requested_items.quantity)::bigint as subtotal_cents,
      (product.unit_cost_cents * requested_items.quantity)::bigint as estimated_cost_cents
    from requested_items
    join public.products product
      on product.id = requested_items.product_id
     and product.user_id = v_user_id
     and product.is_active = true
    where requested_items.quantity > 0
      and requested_items.unit_price_cents >= 0
  )
  select *
  from snapshot_items;

  select
    coalesce(sum(subtotal_cents), 0)::bigint,
    coalesce(sum(estimated_cost_cents), 0)::bigint
  into v_subtotal_cents, v_estimated_cost_cents
  from pg_temp.sale_snapshot_items;

  if v_subtotal_cents = 0 then
    raise exception 'Selecione ao menos um produto ativo.';
  end if;

  v_total_cents := v_subtotal_cents - p_discount_cents + p_delivery_fee_cents;

  if v_total_cents < 0 then
    raise exception 'O total da venda nao pode ficar negativo.';
  end if;

  insert into public.sales (
    user_id,
    customer_id,
    order_date,
    delivery_date,
    status,
    payment_status,
    payment_method,
    subtotal_cents,
    discount_cents,
    delivery_fee_cents,
    total_cents,
    estimated_cost_cents,
    estimated_profit_cents,
    notes
  )
  values (
    v_user_id,
    p_customer_id,
    p_order_date,
    p_delivery_date,
    p_status,
    p_payment_status,
    nullif(trim(p_payment_method), ''),
    v_subtotal_cents,
    p_discount_cents,
    p_delivery_fee_cents,
    v_total_cents,
    v_estimated_cost_cents,
    v_total_cents - v_estimated_cost_cents,
    nullif(trim(p_notes), '')
  )
  returning id into v_sale_id;

  insert into public.sale_items (
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
  select
    v_user_id,
    v_sale_id,
    product_id,
    name,
    sale_unit,
    quantity,
    unit_price_cents,
    unit_cost_cents,
    minimum_price_cents,
    recommended_price_cents,
    subtotal_cents,
    estimated_cost_cents,
    subtotal_cents - estimated_cost_cents
  from pg_temp.sale_snapshot_items;

  return v_sale_id;
end;
$$;

revoke execute on function public.create_sale_with_items(
  uuid,
  date,
  date,
  public.order_status,
  public.payment_status,
  text,
  bigint,
  bigint,
  jsonb,
  text
) from public, anon;

grant execute on function public.create_sale_with_items(
  uuid,
  date,
  date,
  public.order_status,
  public.payment_status,
  text,
  bigint,
  bigint,
  jsonb,
  text
) to authenticated, service_role;
