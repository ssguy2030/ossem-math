'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { NAVER_WA_ID } from '../lib/site';

// 원장님 본인 접속(관리자·로그인 화면)은 방문 통계에서 뺀다. (GoogleAnalytics와 같은 기준)
const EXCLUDED = ['/admin', '/login'];

type NaverWindow = Window & {
  wcs?: unknown;
  wcs_add?: Record<string, string>;
  wcs_do?: () => void;
};

// 네이버 애널리틱스에 현재 페이지 방문 1건을 보낸다. 스크립트가 아직 없으면 false.
function sendPageView() {
  const w = window as NaverWindow;
  if (!w.wcs || typeof w.wcs_do !== 'function') return false;
  w.wcs_add = w.wcs_add || {};
  w.wcs_add['wa'] = NAVER_WA_ID;
  w.wcs_do();
  return true;
}

// Next.js는 페이지 이동 때 새로고침이 없어서, 공식 스크립트만 넣으면 첫 페이지만 집계된다.
// 스크립트 로드 시 첫 페이지를 보내고, 이후 경로가 바뀔 때마다 다시 보낸다.
// lastPath로 같은 경로를 두 번 보내지 않는다.
export default function NaverAnalytics() {
  const pathname = usePathname();
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!NAVER_WA_ID) return;
    // 관리자 화면에 다녀오면 다시 같은 페이지로 돌아와도 1건으로 센다.
    if (excluded) {
      lastPath.current = null;
      return;
    }
    if (lastPath.current === pathname) return;
    if (sendPageView()) lastPath.current = pathname;
  }, [pathname, excluded]);

  if (!NAVER_WA_ID || excluded) return null;

  return (
    <Script
      src="https://wcs.pstatic.net/wcslog.js"
      strategy="afterInteractive"
      onLoad={() => {
        const path = window.location.pathname;
        if (lastPath.current !== path && sendPageView()) lastPath.current = path;
      }}
    />
  );
}
