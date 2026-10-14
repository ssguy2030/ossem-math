-- 앱(관리자 화면·/api/revalidate)에서 "지금 로그인한 계정이 관리자인가"만 확인하는 RPC.
-- 명단 자체는 private 스키마에 그대로 두고, 참/거짓만 돌려준다.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
