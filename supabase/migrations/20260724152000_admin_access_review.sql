revoke update on public.profiles from authenticated;

drop policy if exists "profiles_update_own" on public.profiles;

create or replace function public.update_my_profile(
  p_full_name text,
  p_atelier_name text,
  p_whatsapp text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'not_authenticated';
  end if;

  update public.profiles
  set
    full_name = nullif(trim(p_full_name), ''),
    atelier_name = nullif(trim(p_atelier_name), ''),
    whatsapp = nullif(trim(p_whatsapp), '')
  where id = current_user_id;
end;
$$;

revoke execute on function public.update_my_profile(text, text, text) from public, anon, authenticated;
grant execute on function public.update_my_profile(text, text, text) to authenticated, service_role;
