-- 목록 노출 순서를 직접 정하는 값. 큰 숫자가 먼저 나온다.
-- 비어 있는 글(관리자 화면에서 새로 쓴 글)은 맨 앞에, 그다음 sort_order 내림차순, 그다음 게시일 순.
alter table public.posts add column if not exists sort_order integer;
