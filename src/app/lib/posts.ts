// 공지·칼럼·후기 읽기 전용 데이터 레이어 (서버 컴포넌트·sitemap·RSS 공용).
import { supabase } from './supabase';

export type PostType = 'notice' | 'column' | 'review';

export interface PostSummary {
  id: string;
  type: PostType;
  category: string | null;
  slug: string;
  title: string;
  summary: string;
  thumbnail: string | null;
  published_at: string;
  updated_at: string;
  created_at: string;
}

export interface Post extends PostSummary {
  content: string;
  is_published?: boolean;
}

const LIST_COLUMNS = 'id,type,category,slug,title,summary,thumbnail,published_at,updated_at,created_at';

/** URL 경로 (한글 그대로 — 링크용). 절대 URL이 필요하면 absUrl()로 감싼다. */
export function postPath(p: Pick<PostSummary, 'type' | 'category' | 'slug'>): string {
  if (p.type === 'notice') return `/news/notice/${p.slug}`;
  if (p.type === 'review') return `/review/${p.slug}`;
  return `/news/column/${p.category}/${p.slug}`;
}

/** 동적 세그먼트 값은 환경에 따라 퍼센트 인코딩된 채로 들어올 수 있어 한 번 풀어준다. */
export function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function listPosts(
  type: PostType,
  opts: { category?: string; categories?: string[]; limit?: number } = {},
): Promise<PostSummary[]> {
  if (!supabase) return [];
  let q = supabase
    .from('posts')
    .select(LIST_COLUMNS)
    .eq('type', type)
    .eq('is_published', true)
    // sort_order가 비어 있는 새 글이 맨 앞, 그다음 큰 숫자부터, 그다음 게시일 순
    .order('sort_order', { ascending: false, nullsFirst: true })
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false });
  if (opts.category) q = q.eq('category', opts.category);
  if (opts.categories) q = q.in('category', opts.categories);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) {
    console.error(`listPosts(${type}) 에러:`, error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

export async function getPost(type: PostType, slug: string, category?: string): Promise<Post | null> {
  if (!supabase) return null;
  let q = supabase
    .from('posts')
    .select(`${LIST_COLUMNS},content`)
    .eq('type', type)
    .eq('slug', slug)
    .eq('is_published', true);
  if (category) q = q.eq('category', category);
  const { data, error } = await q.maybeSingle();
  if (error) console.error(`getPost(${type}/${slug}) 에러:`, error.message);
  return (data as Post | null) ?? null;
}

/** sitemap·RSS 용 — 공개된 전체 글 */
export async function listAllPublished(): Promise<PostSummary[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('posts')
    .select(LIST_COLUMNS)
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error) {
    console.error('listAllPublished 에러:', error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

/** "2026-10-14" → "2026.10.14" */
export const formatDate = (iso: string) => iso.slice(0, 10).replaceAll('-', '.');
