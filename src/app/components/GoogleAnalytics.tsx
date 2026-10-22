'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { GA_ID, SNS } from '../lib/site';

// 원장님 본인 접속(관리자·로그인 화면)은 방문 통계에서 뺀다.
const EXCLUDED = ['/admin', '/login'];

// 외부 링크 종류 — GA4 보고서에서 link_type으로 나눠 본다.
const LINK_TYPES: [string, string][] = [
  [new URL(SNS.blog).hostname, 'naver_blog'],
  [new URL(SNS.instagram).hostname, 'instagram'],
  [new URL(SNS.naverMap).hostname, 'naver_map'],
  ['map.naver.com', 'naver_map'],
  ['map.kakao.com', 'kakao_map'],
];

// 사이트 밖으로 나가는 링크 클릭을 external_link_click 이벤트로 보낸다.
// 문서 전체에서 한 번에 잡으므로 메뉴·푸터·본문(칼럼 속 링크 포함) 어디에 새 링크를 넣어도 따로 손댈 필요가 없다.
function trackExternalClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!a) return;
  let url: URL;
  try {
    url = new URL(a.href);
  } catch {
    return;
  }
  if (!/^https?:$/.test(url.protocol) || url.hostname === location.hostname) return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', 'external_link_click', {
    link_url: url.href,
    link_domain: url.hostname,
    link_type: LINK_TYPES.find(([host]) => url.hostname === host)?.[1] ?? 'other',
    // 아이콘만 있는 링크(푸터 SNS)는 aria-label을 쓴다.
    link_text: (a.textContent?.trim() || a.getAttribute('aria-label') || '').slice(0, 100),
    link_position: a.closest('nav') ? 'header' : a.closest('footer') ? 'footer' : 'content',
  });
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));

  // 공개 페이지에서 스크립트가 이미 로드된 뒤 관리자 화면으로 이동해도 수집되지 않도록 끈다.
  useEffect(() => {
    if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = excluded;
  }, [excluded]);

  useEffect(() => {
    if (!GA_ID) return;
    document.addEventListener('click', trackExternalClick, true);
    return () => document.removeEventListener('click', trackExternalClick, true);
  }, []);

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
