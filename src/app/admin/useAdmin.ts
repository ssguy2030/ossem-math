'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
