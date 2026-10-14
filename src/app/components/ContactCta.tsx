import Link from 'next/link';
import { ACADEMY } from '../lib/site';

/** 페이지 하단 공통 상담 안내 (전화번호는 링크 없이 표기) */
export default function ContactCta({ heading = '상담은 전화 한 통으로 시작합니다' }: { heading?: string }) {
  return (
    <section className="bg-brand-dark text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="min-w-0 md:flex-1">
          <h2 className="text-2xl font-bold">{heading}</h2>
          <p className="mt-2 text-blue-100">
            수업 중인 경우가 많아 문자 남겨주시면 연락드리겠습니다.
          </p>
        </div>
        {/* 전화번호·버튼은 줄바꿈 없이 한 줄 */}
        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <p className="whitespace-nowrap text-2xl font-extrabold tracking-wide text-brand-accent">☎ {ACADEMY.phone}</p>
          <Link
            href="/about/location"
            className="inline-flex justify-center whitespace-nowrap bg-brand-accent text-brand-dark font-bold px-5 py-3 rounded-lg hover:bg-brand-accent-hover"
          >
            오시는 길
          </Link>
        </div>
      </div>
    </section>
  );
}
