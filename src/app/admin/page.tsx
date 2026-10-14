'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCategory } from '../lib/categories';
import { formatDate, postPath, type PostType } from '../lib/posts';
import { supabase } from '../lib/supabase';
import { deletePost, useAdmin } from './useAdmin';

interface Row {
  id: string;
  type: PostType;
  category: string | null;
  slug: string;
  title: string;
  published_at: string;
  is_published: boolean;
}

const TYPE_LABEL: Record<PostType, string> = { notice: '공지', column: '칼럼', review: '후기' };

export default function AdminHome() {
  const ready = useAdmin();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<PostType | 'all'>('all');

  useEffect(() => {
    if (!ready || !supabase) return;
    supabase
      .from('posts')
      .select('id,type,category,slug,title,published_at,is_published')
      .order('published_at', { ascending: false })
      .then(({ data }) => setRows((data ?? []) as Row[]));
  }, [ready]);

  const handleDelete = async (r: Row) => {
    if (!confirm(`"${r.title}"\n이 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const error = await deletePost(r);
    if (error) return alert(`삭제 실패: ${error}`);
    setRows((prev) => prev.filter((x) => x.id !== r.id));
  };

  if (!ready) return <p className="py-32 text-center text-gray-500">확인 중…</p>;

  const shown = filter === 'all' ? rows : rows.filter((r) => r.type === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">글 관리</h1>
        <div className="flex gap-2">
          <Link href="/admin/write" className="rounded-lg bg-brand-primary px-5 py-2 font-bold text-white">새 글 쓰기</Link>
          <button
            onClick={async () => { await supabase?.auth.signOut(); router.push('/login'); }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        {(['all', 'notice', 'column', 'review'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-4 py-1 text-sm ${filter === t ? 'bg-gray-900 text-white' : 'border border-gray-300'}`}
          >
            {t === 'all' ? '전체' : TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      <table className="w-full bg-white text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="p-3">종류</th>
            <th className="p-3">제목</th>
            <th className="p-3">게시일</th>
            <th className="p-3">상태</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-3 whitespace-nowrap">
                {TYPE_LABEL[r.type]}
                {r.type === 'column' && r.category && <span className="text-gray-400"> · {getCategory(r.category)?.name}</span>}
              </td>
              <td className="p-3">
                <a href={postPath(r)} target="_blank" rel="noreferrer" className="hover:text-brand-primary">{r.title}</a>
              </td>
              <td className="p-3 whitespace-nowrap">{formatDate(r.published_at)}</td>
              <td className="p-3">{r.is_published ? '공개' : <span className="text-orange-600">임시저장</span>}</td>
              <td className="p-3 text-right whitespace-nowrap">
                <Link href={`/admin/edit/${r.id}`} className="text-brand-primary">수정</Link>
                <button type="button" onClick={() => handleDelete(r)} className="ml-3 text-red-600 hover:underline">
                  삭제
                </button>
              </td>
            </tr>
          ))}
          {shown.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">글이 없습니다.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
