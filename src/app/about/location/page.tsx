import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import PageHeader from '../../components/PageHeader';
import { breadcrumb } from '../../lib/schema';
import { ACADEMY, SNS } from '../../lib/site';

export const metadata: Metadata = {
  title: '오시는 길 - 김천 율곡동 수학학원',
  description: `오쌤수학학원 위치: ${ACADEMY.address}(김천 혁신도시). 운영시간 ${ACADEMY.hours.weekdays}, ${ACADEMY.hours.closed}. 상담 전화 ${ACADEMY.phone}.`,
  alternates: { canonical: '/about/location' },
};

const mapQuery = encodeURIComponent(`${ACADEMY.address} 오쌤수학학원`);

export default function LocationPage() {
  return (
    <>
      <JsonLd data={breadcrumb([['학원소개', '/about/philosophy'], ['오시는 길', '/about/location']])} />
      <PageHeader crumbs={[['학원소개', '/about/philosophy'], ['오시는 길', '/about/location']]} title="오시는 길" />
      <div className="max-w-5xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-2">
        <section aria-labelledby="addr">
          <h2 id="addr" className="sr-only">주소와 운영시간</h2>
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-semibold text-gray-500">주소</dt>
              <dd className="mt-1 text-xl font-bold text-gray-900">{ACADEMY.address}</dd>
              <dd className="mt-1 text-gray-600">김천 혁신도시(율곡동)</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-500">운영시간</dt>
              <dd className="mt-1 text-lg text-gray-900">{ACADEMY.hours.weekdays}</dd>
              <dd className="text-gray-600">{ACADEMY.hours.closed}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://map.naver.com/p/search/${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#03c75a] px-5 py-3 font-bold text-white"
            >
              네이버 지도에서 보기
            </a>
            <a
              href={`https://map.kakao.com/?q=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#fee500] px-5 py-3 font-bold text-gray-900"
            >
              카카오맵에서 보기
            </a>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-h" className="rounded-2xl bg-brand-soft p-8 scroll-mt-24">
          <h2 id="contact-h" className="text-2xl font-bold text-gray-900">상담 문의</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            아이와 함께 방문하셔서 정말 우리 아이에게
            맞는 곳인지 직접 확인해 보세요. 수업 중에는 전화를 받지 못할 수 있으니 문자를 남겨 주세요.
          </p>
          <p className="mt-6 text-sm font-semibold text-gray-500">상담 전화</p>
          <p className="text-3xl font-extrabold text-brand-primary tracking-wide">{ACADEMY.phone}</p>
          <p className="mt-6 text-sm text-gray-600">
            학원 소식은{' '}
            <a href={SNS.blog} target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">
              네이버 블로그
            </a>
            와{' '}
            <a href={SNS.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">
              인스타그램
            </a>
            에서도 볼 수 있습니다.
          </p>
        </section>
      </div>
    </>
  );
}
