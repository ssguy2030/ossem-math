import type { MetadataRoute } from 'next';
import { STATIC_PAGES } from './lib/pageMeta';
import { COLUMN_CATEGORIES } from './lib/categories';
import { listAllPublished, postPath } from './lib/posts';
import { absUrl } from './lib/site';

// 1시간마다 재생성 — 새 글·수정이 재배포 없이 반영된다.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listAllPublished();
  const latest = (filter: (p: (typeof posts)[number]) => boolean, fallback: string) =>
    posts.filter(filter).reduce((max, p) => (p.updated_at > max ? p.updated_at : max), fallback);

  const staticPages = STATIC_PAGES.map(({ path, modified }) => {
    // 목록 페이지는 가장 최근 글 수정일로 lastmod를 끌어올린다.
    const lastModified =
      path === '/review'
        ? latest((p) => p.type === 'review', modified)
        : path === '/news/notice'
          ? latest((p) => p.type === 'notice', modified)
          : path === '/news/column'
            ? latest((p) => p.type === 'column', modified)
            : modified;
    return { url: absUrl(path), lastModified: new Date(lastModified) };
  });

  const categoryPages = COLUMN_CATEGORIES.map((c) => ({
    url: absUrl(`/news/column/${c.slug}`),
    lastModified: new Date(latest((p) => p.type === 'column' && p.category === c.slug, '2026-10-14')),
  }));

  const postPages = posts.map((p) => ({
    url: absUrl(postPath(p)),
    lastModified: new Date(p.updated_at),
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
