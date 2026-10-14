'use client';

import { use, useEffect, useState } from 'react';
import type { Post } from '../../../lib/posts';
import { supabase } from '../../../lib/supabase';
import PostEditor from '../../PostEditor';
import { useAdmin } from '../../useAdmin';

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ready = useAdmin();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    if (!ready || !supabase) return;
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => setPost((data as Post) ?? null));
  }, [ready, id]);

  if (!ready || post === undefined) return <p className="py-32 text-center text-gray-500">불러오는 중…</p>;
  if (post === null) return <p className="py-32 text-center text-gray-500">글을 찾을 수 없습니다.</p>;
  return <PostEditor initial={post} />;
}
