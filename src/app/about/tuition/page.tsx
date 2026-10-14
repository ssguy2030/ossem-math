import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import PageHeader from '../../components/PageHeader';
import { breadcrumb } from '../../lib/schema';
import { ACADEMY, TUITION, formatWon } from '../../lib/site';

export const metadata: Metadata = {
  title: '교습비 안내',
  description: `오쌤수학학원 교습비: 초등수학 월 22만원, 중등수학 월 27만원, 고등수학 월 37만원. 학원등록번호 ${ACADEMY.registrationNo}, 교습과목 수학.`,
  alternates: { canonical: '/about/tuition' },
};

export default function TuitionPage() {
  return (
    <>
      <JsonLd data={breadcrumb([['학원소개', '/about/philosophy'], ['교습비 안내', '/about/tuition']])} />
      <PageHeader crumbs={[['학원소개', '/about/philosophy'], ['교습비 안내', '/about/tuition']]} title="교습비 안내" />
      <div className="max-w-3xl mx-auto px-4 py-14 space-y-12">
        <section aria-labelledby="fee">
          <h2 id="fee" className="text-xl font-bold mb-4">과정별 월 교습비</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-3">교습과정</th>
                <th className="py-3">대상</th>
                <th className="py-3 text-right">월 교습비</th>
              </tr>
            </thead>
            <tbody>
              {TUITION.map((t) => (
                <tr key={t.course} className="border-b border-gray-200">
                  <td className="py-4 font-semibold">{t.course}</td>
                  <td className="py-4 text-gray-600">{t.grade}</td>
                  <td className="py-4 text-right text-lg font-bold">{formatWon(t.fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-gray-500">교육청에 신고한 교습비이며 교재비는 별도입니다.</p>
        </section>

        <section aria-labelledby="reg">
          <h2 id="reg" className="text-xl font-bold mb-4">학원 등록정보</h2>
          <dl className="grid grid-cols-[8rem_1fr] gap-y-3 text-gray-800">
            <dt className="text-gray-500">학원명칭</dt>
            <dd>{ACADEMY.name}</dd>
            <dt className="text-gray-500">학원등록번호</dt>
            <dd>{ACADEMY.registrationNo}</dd>
            <dt className="text-gray-500">교습과목</dt>
            <dd>{ACADEMY.subject}</dd>
            <dt className="text-gray-500">주소</dt>
            <dd>{ACADEMY.address}</dd>
            <dt className="text-gray-500">전화</dt>
            <dd>{ACADEMY.phone}</dd>
          </dl>
        </section>
      </div>
    </>
  );
}
