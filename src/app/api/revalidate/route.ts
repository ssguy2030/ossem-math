import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// 관리자가 글을 저장·삭제한 직후 호출 → 목록·상세·sitemap·RSS를 즉시 갱신한다.
// 로그인 세션의 access token 을 검증해 관리자만 호출할 수 있다.
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!url || !anonKey || !token) return new Response('Unauthorized', { status: 401 });

  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return new Response('Unauthorized', { status: 401 });

  const { paths } = (await request.json()) as { paths?: string[] };
  const targets = new Set(['/', '/sitemap.xml', '/rss.xml', ...(paths ?? [])]);
  for (const p of targets) {
    if (typeof p === 'string' && p.startsWith('/')) revalidatePath(p);
  }
  // 학년별 페이지 하단의 최신 칼럼 목록
  ['/classes/elementary', '/classes/middle', '/classes/high'].forEach((p) => revalidatePath(p));
  return Response.json({ revalidated: [...targets] });
}
