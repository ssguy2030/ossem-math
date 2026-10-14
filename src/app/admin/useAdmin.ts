'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/** 관리자 페이지 공통: 로그인 안 되어 있으면 /login 으로 보낸다. */
export function useAdmin() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login');
      else setReady(true);
    });
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
