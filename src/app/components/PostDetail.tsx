import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { extractFaq, htmlToText, sanitizePostHtml } from '../lib/html';
import { formatDate, postPath, type Post } from '../lib/posts';
import { academyRef, breadcrumb, faqPage } from '../lib/schema';
import { ACADEMY, BRAND, absUrl } from '../lib/site';
import AdminEditButton from './AdminEditButton';
import ContactCta from './ContactCta';
import JsonLd from './JsonLd';

export function postMetadata(post: Post | null, fallbackTitle: string): Metadata {
  if (!post) return { title: fallbackTitle, robots: { index: false } };
  const path = postPath(post);
  const description = post.summary || htmlToText(post.content, 150);
  return {
    title: post.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: `${post.title} | ${BRAND}`,
      description,
      url: path,
      ...(post.type !== 'review' ? { publishedTime: post.published_at, modifiedTime: post.updated_at } : {}),
      ...(post.thumbnail ? { images: [{ url: post.thumbnail, alt: post.title }] } : {}),
    },
  };
}

/**
 * 공지·칼럼·후기 상세 공통 레이아웃.
 * crumbs: 홈 다음부터 목록까지의 경로 (현재 글은 자동으로 붙는다)
 */
export default function PostDetail({
  post,
  crumbs,
  backHref,
  badge,
}: {
  post: Post | null;
  crumbs: [string, string][];
  backHref: string;
  badge?: string;
}) {
  if (!post) notFound();

  const path = postPath(post);
  const html = sanitizePostHtml(post.content);
  const faqs = extractFaq(html);
  const updated = post.updated_at.slice(0, 10);
  // 등록 후 실제로 수정된 글만 "최종 수정" 표시 (과거 날짜로 옮겨 온 글이 오늘 수정된 것처럼 보이지 않게)
  const showUpdated = updated > post.published_at && updated > post.created_at.slice(0, 10);
  // 후기는 정확한 받은 날짜를 알 수 없어 날짜를 표시하지 않는다 (화면·구조화 데이터 모두)
  const showDate = post.type !== 'review';

  const article = {
    '@context': 'https://schema.org',
    '@type': post.type === 'notice' ? 'NewsArticle' : 'Article',
    headline: post.title,
    description: post.summary || htmlToText(post.content, 150),
    ...(showDate ? { datePublished: post.published_at, dateModified: post.updated_at } : {}),
    ...(post.thumbnail ? { image: post.thumbnail.startsWith('/') ? absUrl(post.thumbnail) : post.thumbnail } : {}),
    author: { '@type': 'Person', name: '오쌤', jobTitle: `${ACADEMY.name} 원장`, worksFor: academyRef },
    publisher: academyRef,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absUrl(path) },
    inLanguage: 'ko',
  };

  return (
    <>
      <JsonLd data={[breadcrumb([...crumbs, [post.title, path]]), article, ...(faqs.length ? [faqPage(faqs)] : [])]} />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav aria-label="현재 위치" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-primary">홈</Link>
          {crumbs.map(([name, href], i) => (
            <span key={`${i}-${href}`}>
              {' › '}
              <Link href={href} className="hover:text-brand-primary">{name}</Link>
            </span>
          ))}
        </nav>

        <header className="border-b border-gray-200 pb-6 mb-8">
          {badge && (
            <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-primary mb-3">
              {badge}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
          <div className="mt-4 flex items-center justify-between gap-4 text-sm text-gray-500">
            {showDate ? (
              <p>
                오쌤 · <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                {showUpdated && (
                  <>
                    {' · 최종 수정 '}
                    <time dateTime={updated}>{formatDate(updated)}</time>
                  </>
                )}
              </p>
            ) : (
              <p>오쌤수학 학부모 후기</p>
            )}
            <AdminEditButton id={post.id} />
          </div>
        </header>

        <div
          className={`prose max-w-none ${post.type === 'review' ? 'review-body' : ''}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link href={backHref} className="font-medium text-brand-primary hover:underline">← 목록으로</Link>
        </div>
      </article>
      <ContactCta />
    </>
  );
}
