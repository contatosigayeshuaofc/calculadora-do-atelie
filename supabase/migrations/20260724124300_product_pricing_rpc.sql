create or replace function public.upsert_product_with_cost_items(
  p_product_id uuid,
  p_name text,
  p_category text,
  p_description text,
  p_sale_unit text,
  p_batch_yield integer,
  p_packaging_cost_per_unit_cents bigint,
  p_additional_batch_cost_cents bigint,
  p_selling_price_cents bigint,
  p_minimum_multiplier numeric,
  p_recommended_multiplier numeric,
  p_cost_items jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_product_id uuid;
  v_material_cost_batch_cents bigint;
  v_packaging_cost_batch_cents bigint;
  v_total_cost_batch_cents bigint;
  v_unit_cost_cents bigint;
  v_minimum_price_cents bigint;
  v_recommended_price_cents bigint;
begin
  if v_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  if p_batch_yield <= 0 then
    raise exception 'Informe um rendimento do lote maior que zero.';
  end if;

  if p_recommended_multiplier < p_minimum_multiplier then
    raise exception 'O preco recomendado nao pode ser menor que o minimo.';
  end if;

  if jsonb_array_length(p_cost_items) = 0 then
    raise exception 'Adicione pelo menos um custo.';
  end if;

  with normalized_items as (
    select
      trim(item.name) as name,
      trim(item.unit_measure) as unit_measure,
      item.purchase_quantity,
      item.purchase_price_cents,
      item.used_quantity,
      item.sort_order,
      round(item.purchase_price_cents * (item.used_quantity / item.purchase_quantity))::bigint as calculated_cost_cents
    from jsonb_to_recordset(p_cost_items) as item(
      name text,
      unit_measure text,
      purchase_quantity numeric,
      purchase_price_cents bigint,
      used_quantity numeric,
      sort_order integer
    )
  )
  select coalesce(sum(calculated_cost_cents), 0)::bigint
  into v_material_cost_batch_cents
  from normalized_items;

  v_packaging_cost_batch_cents :=
    (p_packaging_cost_per_unit_cents * p_batch_yield)::bigint;
  v_total_cost_batch_cents :=
    v_material_cost_batch_cents
    + v_packaging_cost_batch_cents
    + p_additional_batch_cost_cents;
  v_unit_cost_cents := round(v_total_cost_batch_cents::numeric / p_batch_yield)::bigint;
  v_minimum_price_cents := round(v_unit_cost_cents * p_minimum_multiplier)::bigint;
  v_recommended_price_cents := round(v_unit_cost_cents * p_recommended_multiplier)::bigint;

  if p_product_id is null then
    insert into public.products (
      user_id,
      name,
      category,
      description,
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
    values (
      v_user_id,
      trim(p_name),
      nullif(trim(p_category), ''),
      nullif(trim(p_description), ''),
      trim(p_sale_unit),
      p_batch_yield,
      p_packaging_cost_per_unit_cents,
      p_additional_batch_cost_cents,
      v_material_cost_batch_cents,
      v_packaging_cost_batch_cents,
      v_total_cost_batch_cents,
      v_unit_cost_cents,
      v_minimum_price_cents,
      v_recommended_price_cents,
      p_selling_price_cents
    )
    returning id into v_product_id;
  else
    update public.products
    set
      name = trim(p_name),
      category = nullif(trim(p_category), ''),
      description = nullif(trim(p_description), ''),
      sale_unit = trim(p_sale_unit),
      batch_yield = p_batch_yield,
      packaging_cost_per_unit_cents = p_packaging_cost_per_unit_cents,
      additional_batch_cost_cents = p_additional_batch_cost_cents,
      material_cost_batch_cents = v_material_cost_batch_cents,
      packaging_cost_batch_cents = v_packaging_cost_batch_cents,
      total_cost_batch_cents = v_total_cost_batch_cents,
      unit_cost_cents = v_unit_cost_cents,
      minimum_price_cents = v_minimum_price_cents,
      recommended_price_cents = v_recommended_price_cents,
      selling_price_cents = p_selling_price_cents
    where id = p_product_id
      and user_id = v_user_id
    returning id into v_product_id;

    if v_product_id is null then
      raise exception 'Produto nao encontrado.';
    end if;

    delete from public.product_cost_items
    where product_id = v_product_id
      and user_id = v_user_id;
  end if;

  insert into public.product_cost_items (
    user_id,
    product_id,
    name,
    unit_measure,
    purchase_quantity,
    purchase_price_cents,
    used_quantity,
    calculated_cost_cents,
    sort_order
  )
  select
    v_user_id,
    v_product_id,
    trim(item.name),
    trim(item.unit_measure),
    item.purchase_quantity,
    item.purchase_price_cents,
    item.used_quantity,
    round(item.purchase_price_cents * (item.used_quantity / item.purchase_quantity))::bigint,
    item.sort_order
  from jsonb_to_recordset(p_cost_items) as item(
    name text,
    unit_measure text,
    purchase_quantity numeric,
    purchase_price_cents bigint,
    used_quantity numeric,
    sort_order integer
  );

  return v_product_id;
end;
$$;

create or replace function public.set_product_active(
  p_product_id uuid,
  p_is_active boolean
)
returns void
language sql
set search_path = ''
as $$
  update public.products
  set is_active = p_is_active
  where id = p_product_id
    and user_id = auth.uid();
$$;

grant execute on function public.upsert_product_with_cost_items(
  uuid,
  text,
  text,
  text,
  text,
  integer,
  bigint,
  bigint,
  bigint,
  numeric,
  numeric,
  jsonb
) to authenticated, service_role;

grant execute on function public.set_product_active(uuid, boolean)
to authenticated, service_role;
