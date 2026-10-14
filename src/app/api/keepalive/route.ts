import { supabase } from '../../lib/supabase';

// Supabase 무료 플랜은 7일간 요청이 없으면 프로젝트가 일시정지된다.
// Vercel Cron(vercel.json)이 매일 이 경로를 호출해 가벼운 조회 1회로 활성 상태를 유지한다.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (!supabase) return Response.json({ ok: false, reason: 'supabase not configured' });
  const { error } = await supabase.from('posts').select('id', { head: true, count: 'exact' }).limit(1);
  return Response.json({ ok: !error, at: new Date().toISOString() });
}
