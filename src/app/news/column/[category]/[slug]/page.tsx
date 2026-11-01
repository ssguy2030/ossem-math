import { notFound, permanentRedirect } from 'next/navigation';
import PostDetail, { postMetadata } from '../../../../components/PostDetail';
import { getCategory } from '../../../../lib/categories';
import { decodeSlug, getPost, postPath } from '../../../../lib/posts';

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
  if (!post) {
    // 카테고리를 바꾼 글은 예전 주소로 들어와도 새 주소로 보낸다 ((type, slug)는 유일)
    const moved = await getPost('column', decodeSlug((await params).slug));
    // Location 헤더에는 한글을 그대로 넣을 수 없어 인코딩한다
    if (moved) permanentRedirect(encodeURI(postPath(moved)));
  }
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
