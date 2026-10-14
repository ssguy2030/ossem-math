'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { postPath, type PostSummary } from '../lib/posts';

/**
 * 관리자 페이지 공통: 로그인 안 되어 있거나 관리자 명단에 없는 계정이면 /login 으로 보낸다.
 * (실제 쓰기 권한은 DB의 RLS가 막는다. 이 확인은 화면 노출을 막는 용도)
 */
export function useAdmin() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    (async () => {
      const { data } = await client.auth.getSession();
      if (!data.session) return router.replace('/login');
      const { data: isAdmin } = await client.rpc('is_admin');
      if (isAdmin !== true) {
        await client.auth.signOut();
        return router.replace('/login?denied=1');
      }
      setReady(true);
    })();
  }, [router]);
  return ready;
}

/** 글 삭제 + 관련 공개 페이지 캐시 갱신. 실패 시 오류 메시지를 돌려준다. */
export async function deletePost(post: Pick<PostSummary, 'id' | 'type' | 'category' | 'slug'>): Promise<string | null> {
  if (!supabase) return 'Supabase 설정이 없습니다.';
  const { data, error } = await supabase.from('posts').delete().eq('id', post.id).select('id');
  if (error) return error.message;
  if (!data || data.length === 0) return '삭제 권한이 없거나 이미 삭제된 글입니다.';
  const list = post.type === 'notice' ? '/news/notice' : post.type === 'review' ? '/review' : '/news/column';
  await revalidate([
    postPath(post),
    list,
    ...(post.type === 'column' && post.category ? [`/news/column/${post.category}`] : []),
  ]);
  return null;
}

/** 저장·삭제 후 공개 페이지 캐시 갱신 */
export async function revalidate(paths: string[]) {
  const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
  const token = data.session?.access_token;
  if (!token) return;
  await fetch('/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ paths }),
  }).catch(() => undefined);
}
