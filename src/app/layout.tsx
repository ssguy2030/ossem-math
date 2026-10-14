import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import JsonLd from './components/JsonLd';
import { academyNode, websiteNode } from './lib/schema';
import { ACADEMY, BRAND, SITE_URL } from './lib/site';

const pretendard = localFont({
  src: '../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `김천 율곡동 혁신도시 수학학원 | ${BRAND}`, template: `%s | ${BRAND}` },
  description: `김천 율곡동(혁신도시) 오쌤수학학원. 김천에서 ${ACADEMY.years}년째, 초·중·고 수학을 ${ACADEMY.classSize} 소수정예와 1:1 맨투맨 퀘스천 수업으로 가르칩니다. 문제풀이보다 개념이해, 평균 등원 기간 ${ACADEMY.avgStay}.`,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    siteName: BRAND,
    locale: 'ko_KR',
    type: 'website',
  },
  // 검색엔진 소유 확인 (구글 서치콘솔 등록 시 google: '...' 추가)
  verification: {
    other: { 'naver-site-verification': '9ba99780bc15a8c9a9ae7acb7a1c8bae2e269124' },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${pretendard.variable} scroll-smooth`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title={`${BRAND} 소식`} href="/rss.xml" />
      </head>
      <body className="font-sans pt-16 antialiased">
        <JsonLd data={[academyNode, websiteNode]} />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
