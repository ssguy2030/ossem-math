import Image from 'next/image';
import Link from 'next/link';
import { CLASSES } from './_data/classes';
import ContactCta from './components/ContactCta';
import JsonLd from './components/JsonLd';
import { PostRows } from './components/PostCards';
import ReviewGrid from './components/ReviewGrid';
import { listPosts } from './lib/posts';
import { faqPage } from './lib/schema';
import { ACADEMY, formatWon } from './lib/site';

export const revalidate = 300;

const homeFaqs = [
  {
    q: '오쌤수학학원은 어디에 있나요?',
    a: `${ACADEMY.address}에 있습니다. 김천 혁신도시(율곡동) 안이라 율곡초·율곡중·운남중·율곡고·김천중앙고 학생들이 많이 다닙니다.`,
  },
  {
    q: '교습비는 얼마인가요?',
    a: '초등수학 월 22만원, 중등수학 월 27만원, 고등수학 월 37만원입니다. 교육청에 신고한 금액이며 교재비는 별도입니다.',
  },
  {
    q: '수업은 어떻게 진행되나요?',
    a: `${ACADEMY.classSize} 소수정예 반에서 개념을 먼저 설명하고, 학생이 막히는 부분을 선생님에게 1:1로 바로 질문하는 '맨투맨 퀘스천' 방식으로 진행합니다. 중고등학생은 개별 질문과 개별 오답풀이를 합니다.`,
  },
  {
    q: '주말 수업도 하나요?',
    a: '정규 주말 수업은 하지 않습니다. 시험 대비 기간에는 수업 없는 날에도 학원에 와서 시험지를 풀고, 시험 직전 주말에 보충을 합니다.',
  },
];

export default async function Home() {
  const [reviews, notices] = await Promise.all([
    listPosts('review', { limit: 6 }),
    listPosts('notice', { limit: 5 }),
  ]);

  return (
    <>
      <JsonLd data={faqPage(homeFaqs)} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark to-brand-primary text-white">
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 md:py-24 lg:pt-14 lg:pb-20 lg:grid lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-12">
          <div>
          <p className="font-semibold text-brand-accent">김천 혁신도시 율곡동 · 초등 · 중등 · 고등</p>
          <h1 className="mt-4 text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
            김천 율곡동 수학학원,
            <br />
            오쌤수학
          </h1>
          <p className="mt-6 text-lg md:text-xl text-blue-50 max-w-2xl leading-relaxed">
            오늘 배운 건 오늘 알고 가게. {ACADEMY.classSize} 소수정예, 모르는 것을 그 자리에서 선생님에게 묻는 맨투맨
            퀘스천 수업으로 김천에서 {ACADEMY.years}년째 수학을 가르치고 있습니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/about/location#contact" className="rounded-lg bg-brand-accent px-6 py-3 font-bold text-brand-dark hover:bg-brand-accent-hover">
              상담 문의
            </Link>
            <Link href="/classes" className="rounded-lg border border-white/60 px-6 py-3 font-bold hover:bg-white/10">
              수업안내 보기
            </Link>
          </div>
          </div>
          {/* 모바일은 가로로 잘라 문구 아래에, 데스크탑은 세로 사진 그대로 오른쪽에 */}
          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20 lg:mt-0 lg:aspect-square">
            <Image
              src="/images/hero-class.jpg"
              alt="오쌤수학학원 교실에서 창가 책상에 앉아 수학 문제를 푸는 학생들"
              fill
              sizes="(min-width: 1152px) 430px, (min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[50%_70%] lg:object-[50%_80%]"
              priority
            />
          </div>
        </div>
      </section>

      {/* 숫자로 보는 오쌤수학 */}
      <section aria-labelledby="numbers" className="max-w-6xl mx-auto px-4 -mt-10">
        <h2 id="numbers" className="sr-only">숫자로 보는 오쌤수학</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [`${ACADEMY.years}년`, '김천에서 수학을 가르친 시간'],
            [ACADEMY.classSize.replace('한 반 ', ''), '한 반 학생 수'],
            [ACADEMY.avgStay, '평균 등원 기간'],
          ].map(([num, label]) => (
            <div key={label} className="rounded-2xl bg-white p-6 shadow-lg text-center">
              <p className="text-3xl font-extrabold text-brand-primary">{num}</p>
              <p className="mt-1 text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 후기 */}
      <section aria-labelledby="review-h" className="max-w-6xl mx-auto px-4 pt-20 pb-20">
        <div className="flex items-end justify-between mb-8">
          <h2 id="review-h" className="text-3xl font-bold text-gray-900">김천수학학원 후기</h2>
          <Link href="/review" className="text-brand-primary hover:underline">전체 보기 →</Link>
        </div>
        <ReviewGrid posts={reviews} />
      </section>

      {/* 학년별 수업 */}
      <section aria-labelledby="classes-h" className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 id="classes-h" className="text-3xl font-bold text-gray-900">학년별 수업안내</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {Object.values(CLASSES).map((c) => (
            <Link
              key={c.grade}
              href={c.path}
              className="group rounded-2xl border border-gray-200 bg-white p-8 hover:border-brand-primary hover:shadow-lg transition"
            >
              <p className="text-sm font-semibold text-brand-primary">{c.title}</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{c.label}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed line-clamp-3">{c.lead}</p>
              <p className="mt-6 flex items-center justify-between">
                <span className="font-bold text-gray-900">월 {formatWon(c.fee)}</span>
                <span className="text-brand-primary group-hover:translate-x-1 transition-transform">자세히 →</span>
              </p>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* 공지 */}
      <section aria-labelledby="notice-h" className="max-w-6xl mx-auto px-4 pb-20">
        <div className="max-w-3xl">
          <div className="flex items-end justify-between mb-8">
            <h2 id="notice-h" className="text-3xl font-bold text-gray-900">공지사항</h2>
            <Link href="/news/notice" className="text-brand-primary hover:underline">더보기 →</Link>
          </div>
          <PostRows posts={notices} empty="새 공지가 없습니다." />
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-h" className="bg-brand-soft">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h2 id="faq-h" className="text-3xl font-bold text-gray-900 mb-8">자주 묻는 질문</h2>
          <dl className="space-y-6">
            {homeFaqs.map((f) => (
              <div key={f.q} className="rounded-2xl bg-white p-6">
                <dt className="font-bold text-gray-900">{f.q}</dt>
                <dd className="mt-2 text-gray-700 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
