import Link from 'next/link';
import { ACADEMY, SNS } from '../lib/site';

const sns = [
  {
    name: '네이버 블로그',
    href: SNS.blog,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
      </svg>
    ),
  },
  {
    name: '인스타그램',
    href: SNS.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:justify-between">
        <div className="space-y-2 text-sm">
          <p className="text-lg font-bold text-white">{ACADEMY.name}</p>
          <p>{ACADEMY.address}</p>
          <p className="text-xs text-gray-500">학원등록번호: {ACADEMY.registrationNo}</p>
          <p className="text-xs text-gray-500">교습비: 초등 22만원 중등 27만원 고등 37만원</p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex gap-3">
            {sns.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-brand-primary flex items-center justify-center text-white transition-colors"
              >
                {item.icon}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/tuition" className="hover:text-white">교습비 안내</Link>
            <Link href="/privacy" className="hover:text-white">개인정보처리방침</Link>
            <Link href="/classes/elementary" className="text-gray-600 hover:text-white">김천 초등수학학원</Link>
            <Link href="/classes/middle" className="text-gray-600 hover:text-white">김천 중등수학학원</Link>
            <Link href="/classes/high" className="text-gray-600 hover:text-white">김천 고등수학학원</Link>
          </div>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} {ACADEMY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
