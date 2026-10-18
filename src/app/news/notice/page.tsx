import type { Metadata } from 'next';
import ListSchema from '../../components/ListSchema';
import PageHeader from '../../components/PageHeader';
import { PostRows } from '../../components/PostCards';
import { listPosts } from '../../lib/posts';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '공지사항',
  description: '오쌤수학학원 시험대비 일정과 방학공지 및 학원 소식을 알려 드립니다.',
  alternates: { canonical: '/news/notice' },
};

export default async function NoticeListPage() {
  const posts = await listPosts('notice');
  return (
    <>
      <ListSchema crumbs={[['소식', '/news/notice'], ['공지사항', '/news/notice']]} name="오쌤수학학원 공지사항" posts={posts} />
      <PageHeader crumbs={[['소식', '/news/notice'], ['공지사항', '/news/notice']]} title="공지사항" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <PostRows posts={posts} />
      </div>
    </>
  );
}
