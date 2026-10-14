'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { deletePost } from '../admin/useAdmin';
import type { PostSummary } from '../lib/posts';

const LIST_PATH = { notice: '/news/notice', column: '/news/column', review: '/review' } as const;

/** 관리자로 로그인한 경우에만 글 상세에 "수정"·"삭제" 버튼을 보여준다. */
export default function AdminEditButton({ post }: { post: Pick<PostSummary, 'id' | 'type' | 'category' | 'slug' | 'title'> }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    client.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: ok } = await client.rpc('is_admin');
      setIsAdmin(ok === true);
    });
  }, []);

  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (!confirm(`"${post.title}"\n이 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setDeleting(true);
    const error = await deletePost(post);
    setDeleting(false);
    if (error) return alert(`삭제 실패: ${error}`);
    router.push(LIST_PATH[post.type]);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <Link href={`/admin/edit/${post.id}`} className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white">
        수정
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? '삭제 중…' : '삭제'}
      </button>
    </div>
  );
}
