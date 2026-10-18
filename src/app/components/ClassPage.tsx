import type { Metadata } from 'next';
import { CLASSES, EXAM_PREP } from '../_data/classes';
import type { Grade } from '../lib/categories';
import { academyRef, breadcrumb, faqPage } from '../lib/schema';
import { ACADEMY, absUrl, formatWon } from '../lib/site';
import ContactCta from './ContactCta';
import JsonLd from './JsonLd';
import PageHeader from './PageHeader';

export function classMetadata(grade: Grade): Metadata {
  const c = CLASSES[grade];
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: c.path },
    openGraph: { title: c.h1, description: c.description, url: c.path },
  };
}

export default function ClassPage({ grade }: { grade: Grade }) {
  const c = CLASSES[grade];

  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${c.course} (${c.label})`,
    description: c.description,
    url: absUrl(c.path),
    provider: academyRef,
    inLanguage: 'ko',
    offers: { '@type': 'Offer', price: c.fee, priceCurrency: 'KRW', category: '월 교습비' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: { '@type': 'Place', name: ACADEMY.name, address: ACADEMY.address },
    },
  };

  return (
    <>
      <JsonLd data={[breadcrumb([['수업안내', '/classes'], [c.label, c.path]]), course, faqPage(c.faqs)]} />
      <PageHeader crumbs={[['수업안내', '/classes'], [c.label, c.path]]} title={c.h1} lead={c.lead} />

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-16">
        {/* 한눈에 보기 */}
        <section aria-labelledby="summary" className="grid gap-4 sm:grid-cols-3">
          <h2 id="summary" className="sr-only">{c.label} 한눈에 보기</h2>
          {[
            ['수업 인원', `${ACADEMY.classSize} 소수정예`],
            ['수업 방식', '맨투맨 퀘스천 (1:1 질문)'],
            ['월 교습비', formatWon(c.fee)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-brand-soft p-6">
              <p className="text-sm text-gray-500">{k}</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{v}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="goals">
          <h2 id="goals" className="text-2xl font-bold mb-6">{c.label}에서 하는 일</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {c.goals.map((g) => (
              <div key={g.title} className="rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-brand-primary">{g.title}</h3>
                <p className="mt-2 text-gray-700 leading-relaxed">{g.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="schedule">
          <h2 id="schedule" className="text-2xl font-bold mb-6">반 구성과 수업 시간</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="py-3 pr-4">반</th>
                  <th className="py-3 pr-4">내용</th>
                  <th className="py-3">시간</th>
                </tr>
              </thead>
              <tbody>
                {c.schedule.map((s) => (
                  <tr key={s.name} className="border-b border-gray-200">
                    <td className="py-4 pr-4 font-semibold">{s.name}</td>
                    <td className="py-4 pr-4 text-gray-600">{s.detail}</td>
                    <td className="py-4 font-medium text-brand-primary">{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {c.scheduleNote && <p className="mt-3 text-sm text-gray-500">{c.scheduleNote}</p>}
        </section>

        {grade !== 'elementary' && (
          <section aria-labelledby="exam">
            <h2 id="exam" className="text-2xl font-bold mb-6">시험 대비는 이렇게 합니다</h2>
            <ol className="grid gap-4 md:grid-cols-2">
              {EXAM_PREP.map((e, i) => (
                <li key={e.title} className="rounded-2xl bg-gray-50 p-6">
                  <p className="text-sm font-bold text-brand-primary">STEP {i + 1}</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{e.title}</h3>
                  <p className="mt-2 text-gray-700 leading-relaxed">{e.body}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section aria-labelledby="books" className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 id="books" className="text-2xl font-bold mb-4">사용 교재</h2>
            <dl className="space-y-3">
              {c.books.map((b) => (
                <div key={b.label} className="flex gap-4">
                  <dt className="w-20 shrink-0 font-semibold text-gray-500">{b.label}</dt>
                  <dd className="text-gray-800">{b.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-gray-500">
              기초가 부족한 학생은 교과서 문제 위주의 프린트 제본 교재로 기본기를 먼저 다집니다.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">등록부터 수업까지</h2>
            <ol className="space-y-3">
              {c.flow.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-gray-800">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {c.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none flex justify-between gap-4 font-semibold text-gray-900">
                  <h3>{f.q}</h3>
                  <span className="text-brand-primary group-open:rotate-45 transition-transform" aria-hidden>＋</span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <ContactCta heading={`${c.label} 상담 안내`} />
    </>
  );
}
