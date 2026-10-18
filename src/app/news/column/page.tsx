import type { Metadata } from 'next';
import CategoryTabs from '../../components/CategoryTabs';
import ListSchema from '../../components/ListSchema';
import PageHeader from '../../components/PageHeader';
import { PostCards } from '../../components/PostCards';
import { listPosts } from '../../lib/posts';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '오쌤수학칼럼',
  description:
    '율곡중·운남중·율곡고·김천중앙고 수학 시험범위와 출제 경향, 김천 초등 수학 학습가이드. 김천에서 20년째 수학을 가르치는 오쌤이 학교별로 정리합니다.',
  alternates: { canonical: '/news/column' },
};

export default async function ColumnListPage() {
  const posts = await listPosts('column');
  return (
    <>
      <ListSchema crumbs={[['소식', '/news/notice'], ['칼럼', '/news/column']]} name="오쌤수학칼럼" posts={posts} />
      <PageHeader
        crumbs={[['소식', '/news/notice'], ['칼럼', '/news/column']]}
        title="오쌤수학칼럼"
        lead="수학이 즐거워지는 그날까지, 김천 아이들과 함께 고민한 이야기를 씁니다."
      />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <CategoryTabs />
        <PostCards posts={posts} empty="칼럼이 곧 올라옵니다." />
      </div>
    </>
  );
}
