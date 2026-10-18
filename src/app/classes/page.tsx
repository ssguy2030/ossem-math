import type { Metadata } from 'next';
import Link from 'next/link';
import { CLASSES } from '../_data/classes';
import ContactCta from '../components/ContactCta';
import JsonLd from '../components/JsonLd';
import PageHeader from '../components/PageHeader';
import { breadcrumb } from '../lib/schema';
import { ACADEMY, formatWon } from '../lib/site';

export const metadata: Metadata = {
  title: '수업안내 - 초·중·고 수학 로드맵',
  description: `오쌤수학학원 초등부·중등부·고등부 수업 안내. 초등 개념과 사고력, 중등 학교별 내신, 고등 내신·수능까지 ${ACADEMY.classSize} 소수정예로 이어지는 김천 율곡동 수학 로드맵.`,
  alternates: { canonical: '/classes' },
};

const roadmap = [
  { grade: 'elementary' as const, stage: '초2 ~ 초6', point: '오늘 배운 개념은 오늘 이해하기, 교구 사고력 활동, 6학년 예비중 과정' },
  { grade: 'middle' as const, stage: '중1 ~ 중3', point: 'A반(Advanced)·B반(Basic), 시험 4주 전부터 학교별 기출 대비' },
  { grade: 'high' as const, stage: '고1 ~ 고3', point: '율곡고·김천중앙고 등 학교별·타 학교 기출 내신 대비, 스스로 공부하는 습관 관리' },
];

export default function ClassesPage() {
  return (
    <>
      <JsonLd data={breadcrumb([['수업안내', '/classes']])} />
      <PageHeader
        crumbs={[['수업안내', '/classes']]}
        title="초·중·고 수학, 한 곳에서 길게"
        lead={`오쌤수학의 평균 등원 기간은 ${ACADEMY.avgStay}입니다. 초등에서 쌓은 개념이 중등 내신으로, 중등 실력이 고등 내신과 수능으로 끊기지 않게 이어 갑니다.`}
      />
      <div className="max-w-5xl mx-auto px-4 py-14">
        <ol className="space-y-6">
          {roadmap.map(({ grade, stage, point }, i) => {
            const c = CLASSES[grade];
            return (
              <li key={grade}>
                <Link
                  href={c.path}
                  className="flex flex-col md:flex-row md:items-center gap-4 rounded-2xl border border-gray-200 p-6 md:p-8 hover:border-brand-primary hover:shadow-md transition"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xl font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{stage}</p>
                    <h2 className="text-2xl font-bold text-gray-900">{c.label}</h2>
                    <p className="mt-2 text-gray-700">{point}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">월 교습비</p>
                    <p className="text-xl font-bold text-brand-primary">{formatWon(c.fee)}</p>
                    <p className="mt-1 text-sm text-brand-primary">자세히 보기 →</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <ContactCta />
    </>
  );
}
