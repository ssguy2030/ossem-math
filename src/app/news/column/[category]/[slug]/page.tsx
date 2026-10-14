import { notFound } from 'next/navigation';
import PostDetail, { postMetadata } from '../../../../components/PostDetail';
import { getCategory } from '../../../../lib/categories';
import { decodeSlug, getPost } from '../../../../lib/posts';

export const revalidate = 3600;
// 빈 목록 → 첫 방문 시 생성 후 캐시(ISR). 저장 시 /api/revalidate 로 즉시 갱신.
export const generateStaticParams = async () => [];

type Props = { params: Promise<{ category: string; slug: string }> };

async function load(params: Props['params']) {
  const { category, slug } = await params;
  const cat = getCategory(category);
  const post = cat ? await getPost('column', decodeSlug(slug), cat.slug) : null;
  return { cat, post };
}

export async function generateMetadata({ params }: Props) {
  const { post } = await load(params);
  return postMetadata(post, '칼럼');
}

export default async function ColumnDetailPage({ params }: Props) {
  const { cat, post } = await load(params);
  if (!cat) notFound();
  return (
    <PostDetail
      post={post}
      crumbs={[
        ['칼럼', '/news/column'],
        [cat.name, `/news/column/${cat.slug}`],
      ]}
      backHref={`/news/column/${cat.slug}`}
      badge={cat.name}
    />
  );
}
