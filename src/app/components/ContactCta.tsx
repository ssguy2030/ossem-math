import Link from 'next/link';
import { ACADEMY } from '../lib/site';

/** 페이지 하단 공통 상담 안내 (전화번호는 링크 없이 표기) */
export default function ContactCta({ heading = '상담은 전화 한 통으로 시작합니다' }: { heading?: string }) {
  return (
    <section className="bg-brand-dark text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold">{heading}</h2>
          <p className="mt-2 text-blue-100">
            학년과 학교, 지금 성적을 알려 주시면 아이에게 맞는 반을 안내해 드립니다. 수업 중이면 문자를 남겨 주세요.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <p className="text-2xl font-extrabold tracking-wide text-brand-accent">☎ {ACADEMY.phone}</p>
          <Link
            href="/about/location"
            className="inline-flex justify-center bg-brand-accent text-brand-dark font-bold px-5 py-3 rounded-lg hover:bg-brand-accent-hover"
          >
            오시는 길
          </Link>
        </div>
      </div>
    </section>
  );
}
