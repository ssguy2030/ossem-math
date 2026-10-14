'use client';

import PostEditor from '../PostEditor';
import { useAdmin } from '../useAdmin';

export default function WritePage() {
  const ready = useAdmin();
  if (!ready) return <p className="py-32 text-center text-gray-500">확인 중…</p>;
  return <PostEditor />;
}
