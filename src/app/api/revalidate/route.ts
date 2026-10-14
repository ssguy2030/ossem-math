import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// 관리자가 글을 저장·삭제한 직후 호출 → 목록·상세·sitemap·RSS를 즉시 갱신한다.
// 로그인 토큰을 검증한 뒤, 그 계정이 관리자 명단(private.admins)에 있는지까지 확인한다.
const MAX_PATHS = 20;

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!url || !anonKey || !token) return new Response('Unauthorized', { status: 401 });

  // 사용자 토큰으로 요청하는 클라이언트 → is_admin()이 그 사용자 기준으로 평가된다
  const client = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userError } = await client.auth.getUser(token);
  if (userError || !userData.user) return new Response('Unauthorized', { status: 401 });
  const { data: isAdmin, error: adminError } = await client.rpc('is_admin');
  if (adminError || isAdmin !== true) return new Response('Forbidden', { status: 403 });

  let paths: unknown = [];
  try {
    paths = ((await request.json()) as { paths?: unknown }).paths ?? [];
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
  const valid = (Array.isArray(paths) ? paths : [])
    .filter((p): p is string => typeof p === 'string' && p.startsWith('/') && !p.startsWith('//') && p.length < 300)
    .slice(0, MAX_PATHS);

  const targets = new Set(['/', '/sitemap.xml', '/rss.xml', ...valid]);
  for (const p of targets) revalidatePath(p);
  // 학년별 페이지 하단의 최신 칼럼 목록
  ['/classes/elementary', '/classes/middle', '/classes/high'].forEach((p) => revalidatePath(p));
  return Response.json({ revalidated: [...targets] });
}
