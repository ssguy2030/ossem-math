import Image from 'next/image';
import Link from 'next/link';
import { postPath, type PostSummary } from '../lib/posts';

/** 후기 사진 그리드: 모바일 2열, 데스크탑 3열. 누르면 상세(글 + 사진 전체). */
export default function ReviewGrid({ posts, empty = '후기가 곧 올라옵니다.' }: { posts: PostSummary[]; empty?: string }) {
  if (posts.length === 0) return <p className="text-gray-500 py-12 text-center">{empty}</p>;
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
      {posts.map((p, i) => (
        <li key={p.id}>
          <Link
            href={postPath(p)}
            className="group block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-brand-primary hover:shadow-lg"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#b2c7da]">
              {p.thumbnail && (
                <Image
                  src={p.thumbnail}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  priority={i < 3}
                />
              )}
              {/* 아래쪽을 자연스럽게 잘라 "더 보기" 느낌 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="p-3 md:p-4">
              <h3 className="text-sm md:text-base font-bold leading-snug text-gray-900 line-clamp-2">{p.title}</h3>
              <p className="mt-1 text-xs text-brand-primary">전체 보기 →</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
