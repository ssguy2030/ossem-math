import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 서버(공개 글 읽기)와 브라우저(관리자 로그인·글쓰기)에서 같이 쓰는 클라이언트.
 * 서버에서는 세션을 저장하지 않는다.
 * 환경변수가 아직 없을 때(프로젝트 연결 전)는 null — 페이지는 빈 목록으로 렌더된다.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: typeof window !== 'undefined' },
      })
    : null;
