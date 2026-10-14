-- 보안 강화: "로그인한 사람이면 누구나 쓰기" → "관리자 명단에 있는 계정만 쓰기"
--
-- 회원가입을 꺼 두었더라도, 실수로 가입이 다시 켜지거나 계정이 추가되면
-- 그 계정도 글을 쓰고 지울 수 있던 구조를 막는다.
-- 명단 테이블·확인 함수는 API(PostgREST)에 노출되지 않는 private 스키마에 둔다.
--
-- 관리자 추가:   insert into private.admins (user_id) values ('<auth.users.id>');
-- 관리자 제거:   delete from private.admins where user_id = '<auth.users.id>';

create schema if not exists private;

create table if not exists private.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table private.admins enable row level security; -- 정책 없음 = API로 접근 불가

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from private.admins where user_id = (select auth.uid()));
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

-- posts: 공개 글은 누구나 읽기, 그 외(임시저장 읽기·쓰기·수정·삭제)는 관리자만
drop policy if exists "read posts" on public.posts;
drop policy if exists "admin insert posts" on public.posts;
drop policy if exists "admin update posts" on public.posts;
drop policy if exists "admin delete posts" on public.posts;

create policy "read posts" on public.posts
  for select using (is_published or (select private.is_admin()));
create policy "admin insert posts" on public.posts
  for insert to authenticated with check ((select private.is_admin()));
create policy "admin update posts" on public.posts
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin delete posts" on public.posts
  for delete to authenticated using ((select private.is_admin()));

-- 이미지: 관리자만 업로드·삭제
drop policy if exists "admin upload images" on storage.objects;
drop policy if exists "admin delete images" on storage.objects;
create policy "admin upload images" on storage.objects
  for insert to authenticated with check (bucket_id = 'images' and (select private.is_admin()));
create policy "admin delete images" on storage.objects
  for delete to authenticated using (bucket_id = 'images' and (select private.is_admin()));

-- 테이블 권한 최소화: 방문자(anon)는 읽기만, TRUNCATE 등 RLS가 적용되지 않는 권한은 회수
revoke all on table public.posts from anon;
grant select on table public.posts to anon;
revoke truncate, references, trigger on table public.posts from authenticated;
