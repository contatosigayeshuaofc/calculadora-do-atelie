revoke execute on function public.upsert_product_with_cost_items(
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
) from public, anon;

revoke execute on function public.set_product_active(uuid, boolean)
from public, anon;

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon;

alter default privileges for role postgres in schema public
  revoke execute on functions from public;

alter default privileges for role postgres in schema public
  revoke execute on functions from anon;

alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon;
