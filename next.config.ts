import type { NextConfig } from 'next';

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : '*.supabase.co';

const isDev = process.env.NODE_ENV !== 'production';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-eval'은 개발 서버(HMR)에서만 필요 — 운영에서는 제외
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      `img-src 'self' data: blob: https://${supabaseHost} https://i.ytimg.com`,
      `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}${isDev ? ' ws:' : ''}`,
      'frame-src https://www.youtube.com https://www.youtube-nocookie.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(isDev ? [] : ['upgrade-insecure-requests']),
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    // 우리 Supabase 저장소 이미지만 최적화 (다른 프로젝트 이미지로 서버 자원을 쓰지 못하게)
    remotePatterns: [
      { protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/images/**' },
    ],
  },

  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },

  async redirects() {
    return [
      { source: '/about', destination: '/about/philosophy', permanent: true },
      { source: '/news', destination: '/news/notice', permanent: true },
      { source: '/notice', destination: '/news/notice', permanent: true },
      { source: '/blog', destination: '/news/column', permanent: true },
      { source: '/column', destination: '/news/column', permanent: true },
      { source: '/reviews', destination: '/review', permanent: true },
      { source: '/elementary', destination: '/classes/elementary', permanent: true },
      { source: '/middle', destination: '/classes/middle', permanent: true },
      { source: '/high', destination: '/classes/high', permanent: true },
      { source: '/location', destination: '/about/location', permanent: true },
      { source: '/tuition', destination: '/about/tuition', permanent: true },
    ];
  },
};

export default nextConfig;
