'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/** 관리자로 로그인한 경우에만 글 상세에 "수정" 버튼을 보여준다. */
export default function AdminEditButton({ id }: { id: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
  }, []);
  if (!isAdmin) return null;
  return (
    <Link href={`/admin/edit/${id}`} className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white">
      수정
    </Link>
  );
}
