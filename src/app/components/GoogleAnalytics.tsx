'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { GA_ID } from '../lib/site';

// 원장님 본인 접속(관리자·로그인 화면)은 방문 통계에서 뺀다.
const EXCLUDED = ['/admin', '/login'];

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));

  // 공개 페이지에서 스크립트가 이미 로드된 뒤 관리자 화면으로 이동해도 수집되지 않도록 끈다.
  useEffect(() => {
    if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = excluded;
  }, [excluded]);

  if (!GA_ID || excluded) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
