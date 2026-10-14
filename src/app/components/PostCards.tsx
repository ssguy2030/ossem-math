import Link from 'next/link';
import { formatDate, postPath, type PostSummary } from '../lib/posts';
import { getCategory } from '../lib/categories';

export function PostCards({ posts, empty = '아직 등록된 글이 없습니다.' }: { posts: PostSummary[]; empty?: string }) {
  if (posts.length === 0) return <p className="text-gray-500 py-12 text-center">{empty}</p>;
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {posts.map((p) => {
        const cat = p.category ? getCategory(p.category) : undefined;
        return (
          <li key={p.id}>
            <Link
              href={postPath(p)}
              className="block h-full rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-primary hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                {cat && <span className="rounded-full bg-brand-soft text-brand-primary px-2 py-0.5 font-semibold">{cat.name}</span>}
                <time dateTime={p.published_at}>{formatDate(p.published_at)}</time>
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">{p.title}</h3>
              {p.summary && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.summary}</p>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** 공지사항처럼 제목 위주 목록 */
export function PostRows({ posts, empty = '아직 등록된 글이 없습니다.' }: { posts: PostSummary[]; empty?: string }) {
  if (posts.length === 0) return <p className="text-gray-500 py-12 text-center">{empty}</p>;
  return (
    <ul className="divide-y divide-gray-200 border-y border-gray-200">
      {posts.map((p) => (
        <li key={p.id}>
          <Link href={postPath(p)} className="flex items-center justify-between gap-4 py-4 hover:text-brand-primary">
            <span className="font-medium">{p.title}</span>
            <time dateTime={p.published_at} className="shrink-0 text-sm text-gray-500">{formatDate(p.published_at)}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
