import type { NextConfig } from 'next';

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : '*.supabase.co';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      `img-src 'self' data: blob: https://${supabaseHost} https://i.ytimg.com https://www.googletagmanager.com https://www.google-analytics.com`,
      "form-action 'self'",
      "frame-ancestors 'none'",
      'frame-src https://www.youtube.com https://www.youtube-nocookie.com https://map.naver.com https://map.kakao.com',
      `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://*.google-analytics.com https://www.googletagmanager.com`,
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
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
