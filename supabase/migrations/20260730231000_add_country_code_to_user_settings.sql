alter table public.user_settings
  add column if not exists country_code text not null default 'BR';

alter table public.user_settings
  drop constraint if exists user_settings_country_code_supported;

alter table public.user_settings
  add constraint user_settings_country_code_supported
  check (
    country_code in (
      'BR',
      'PT',
      'US',
      'GB',
      'CA',
      'AU',
      'MX',
      'AR',
      'CL'
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_country_code text := coalesce(nullif(new.raw_user_meta_data ->> 'country_code', ''), 'BR');
  v_currency_code text := coalesce(nullif(new.raw_user_meta_data ->> 'currency_code', ''), 'BRL');
begin
  if v_country_code not in ('BR', 'PT', 'US', 'GB', 'CA', 'AU', 'MX', 'AR', 'CL') then
    v_country_code := 'BR';
  end if;

  if v_currency_code not in ('BRL', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MXN', 'ARS', 'CLP') then
    v_currency_code := 'BRL';
  end if;

  insert into public.profiles (id, full_name, atelier_name, whatsapp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'atelier_name', ''),
    nullif(new.raw_user_meta_data ->> 'whatsapp', '')
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    atelier_name = excluded.atelier_name,
    whatsapp = excluded.whatsapp;

  insert into public.user_settings (user_id, country_code, currency_code)
  values (new.id, v_country_code, v_currency_code)
  on conflict (user_id) do update
  set
    country_code = excluded.country_code,
    currency_code = excluded.currency_code;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
