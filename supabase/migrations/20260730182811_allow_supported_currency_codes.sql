alter table public.user_settings
  drop constraint if exists currency_code_brl_only;

alter table public.user_settings
  drop constraint if exists user_settings_currency_code_supported;

alter table public.user_settings
  add constraint user_settings_currency_code_supported
  check (
    currency_code in (
      'BRL',
      'USD',
      'EUR',
      'GBP',
      'CAD',
      'AUD',
      'MXN',
      'ARS',
      'CLP'
    )
  );
