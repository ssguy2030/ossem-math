import type { Metadata } from 'next';
import ContactCta from '../components/ContactCta';
import ListSchema from '../components/ListSchema';
import PageHeader from '../components/PageHeader';
import ReviewGrid from '../components/ReviewGrid';
import { listPosts } from '../lib/posts';
import { ACADEMY } from '../lib/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '김천수학학원 후기',
  description: `오쌤수학학원 학생·학부모의 실제 후기. 성적 변화, 수업 방식, 평균 등원 기간 ${ACADEMY.avgStay}의 이유까지 김천 수학학원을 고를 때 참고할 이야기를 모았습니다.`,
  alternates: { canonical: '/review' },
};

export default async function ReviewListPage() {
  const posts = await listPosts('review');
  return (
    <>
      <ListSchema crumbs={[['후기', '/review']]} name="오쌤수학학원 후기" posts={posts} />
      <PageHeader
        crumbs={[['후기', '/review']]}
        title="김천수학학원 후기"
        lead="학부모님들이 오쌤수학을 선택하는 이유를 아래에서 직접 확인해보세요"
      />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <ReviewGrid posts={posts} />
      </div>
      <ContactCta />
    </>
  );
}
