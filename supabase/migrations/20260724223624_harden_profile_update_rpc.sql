grant update (full_name, atelier_name, whatsapp) on public.profiles to authenticated;

drop policy if exists "profiles_update_safe_own_fields" on public.profiles;
create policy "profiles_update_safe_own_fields"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

alter function public.update_my_profile(text, text, text) security invoker;
