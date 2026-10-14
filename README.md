# 오쌤수학 홈페이지

Next.js App Router + Supabase. 쓱싹(sseuksak-web) 구조를 바탕으로 만들었다.

## Supabase
- 프로젝트: `ossem-math-web` (조직 ossem, 리전 ap-northeast-2 서울, 무료 플랜)
- URL: https://uwtbimctivirywujnoft.supabase.co
- 스키마: `supabase/migrations/0001_init.sql` 적용 완료 (posts 테이블, RLS, images 버킷)
- `.env.local`에 URL·publishable key·CRON_SECRET 설정 완료 (git 제외)

## 보안 구조
- 회원가입은 꺼져 있다 (Authentication → Sign In / Providers).
- 글·이미지 쓰기는 **관리자 명단(`private.admins`)에 있는 계정만** 가능하다. 로그인만으로는 쓸 수 없다.
  - 관리자 추가: Supabase SQL Editor에서 `insert into private.admins (user_id) values ('<Authentication → Users의 User UID>');`
  - 관리자 제거: `delete from private.admins where user_id = '<UID>';`
- 마이그레이션: `0001_init.sql` → `0002_admin_allowlist.sql` → `0003_is_admin_rpc.sql`
- `/api/revalidate`는 관리자 토큰만, `/api/keepalive`는 `CRON_SECRET`만 허용한다.

## 처음 설정 (남은 것)
1. Supabase 대시보드 → Authentication → Users → **Add user**로 관리자 계정 1개 추가
2. Authentication → Sign In / Providers → **Allow new users to sign up 끄기**
3. `npm install` → `npm run dev` (http://localhost:3000) → `/login`

## 글쓰기
`/login` → `/admin` → 새 글 쓰기. 종류(공지/칼럼/후기)와 칼럼 학교 카테고리 선택.
저장하면 `/api/revalidate`가 목록·상세·sitemap·RSS를 즉시 갱신한다.

## 정보 수정 위치
- 학원 정보·교습비·SNS: `src/app/lib/site.ts`
- 학년별 페이지 내용·시간표·FAQ: `src/app/_data/classes.ts`
- 칼럼 카테고리(학교 추가): `src/app/lib/categories.ts`
- 메뉴: `src/app/lib/nav.ts`
- 고정 페이지 수정일(sitemap): `src/app/lib/pageMeta.ts`

## 배포
- Vercel 프로젝트 `ossem-math` — https://ossem-math.vercel.app
- GitHub `ssguy2030/ossem-math`의 main에 푸시하면 자동 배포
- 도메인을 구입하면 `site.ts`의 `SITE_URL`을 바꾸고 Vercel → Settings → Domains에 연결
- 네이버 서치어드바이저·구글 서치콘솔 등록 → `layout.tsx`의 `verification`에 코드 입력
- 사이트맵 `/sitemap.xml`, RSS `/rss.xml` 제출
- Vercel 환경변수에 `CRON_SECRET` 설정 (Supabase 무료 플랜 일시정지 방지 cron)
