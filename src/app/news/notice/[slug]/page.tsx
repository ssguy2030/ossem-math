import PostDetail, { postMetadata } from '../../../components/PostDetail';
import { decodeSlug, getPost } from '../../../lib/posts';

export const revalidate = 3600;
// 빈 목록 → 첫 방문 시 생성 후 캐시(ISR). 저장 시 /api/revalidate 로 즉시 갱신.
export const generateStaticParams = async () => [];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const post = await getPost('notice', decodeSlug((await params).slug));
  return postMetadata(post, '공지사항');
}

export default async function NoticeDetailPage({ params }: Props) {
  const post = await getPost('notice', decodeSlug((await params).slug));
  return <PostDetail post={post} crumbs={[['공지사항', '/news/notice']]} backHref="/news/notice" badge="공지" />;
}
