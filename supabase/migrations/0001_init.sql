-- 오쌤수학 홈페이지: 공지·칼럼·후기를 한 테이블(posts)로 관리한다.
--   type     : notice | column | review
--   category : 칼럼일 때만 사용 (elementary | yulgok-middle | unnam-middle | yulgok-high | jungang-high)
--   slug     : URL 마지막 조각. 한글 허용. (type, slug) 조합이 유일해야 한다.

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  type          text not null check (type in ('notice', 'column', 'review')),
  category      text,
  slug          text not null,
  title         text not null,
  summary       text not null default '',
  content       text not null default '',
  thumbnail     text,
  published_at  date not null default (now() at time zone 'Asia/Seoul')::date,
  updated_at    timestamptz not null default now(),
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  constraint posts_type_slug_key unique (type, slug),
  constraint posts_column_needs_category check (type <> 'column' or category is not null),
  constraint posts_slug_format check (slug ~ '^[0-9a-z가-힣]+(-[0-9a-z가-힣]+)*$')
);

create index if not exists posts_type_published_idx on public.posts (type, published_at desc);
create index if not exists posts_category_idx on public.posts (category, published_at desc);

-- 수정 시각 자동 갱신 → sitemap lastmod · Article dateModified 에 사용
create or replace function public.touch_updated_at()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- RLS: 누구나 공개 글 읽기, 로그인한 관리자만 쓰기.
-- (Authentication > Sign In / Providers 에서 "Allow new users to sign up" 을 꺼서
--  관리자 계정 외에는 가입할 수 없게 한다.)
alter table public.posts enable row level security;

-- 읽기: 방문자는 공개 글만, 로그인한 관리자는 임시저장 글까지
create policy "read posts" on public.posts
  for select using (is_published or (select auth.role()) = 'authenticated');

create policy "admin insert posts" on public.posts
  for insert to authenticated with check (true);

create policy "admin update posts" on public.posts
  for update to authenticated using (true) with check (true);

create policy "admin delete posts" on public.posts
  for delete to authenticated using (true);

-- 이미지 저장소: 공개 버킷(공개 URL로 읽기), 관리자만 업로드·삭제.
-- 공개 버킷은 select 정책 없이도 URL로 읽히므로, 파일 목록 노출을 막기 위해 select 정책은 두지 않는다.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do nothing;

drop policy if exists "admin upload images" on storage.objects;
create policy "admin upload images" on storage.objects
  for insert to authenticated with check (bucket_id = 'images');

drop policy if exists "admin delete images" on storage.objects;
create policy "admin delete images" on storage.objects
  for delete to authenticated using (bucket_id = 'images');
