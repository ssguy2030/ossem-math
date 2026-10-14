import type { MetadataRoute } from 'next';
import { SITE_URL } from './lib/site';

const PRIVATE = ['/admin', '/login', '/api'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // OpenAI (검색·실시간 인용용 — 가장 중요)
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: PRIVATE },
      { userAgent: 'GPTBot', allow: '/', disallow: PRIVATE },
      // Anthropic
      { userAgent: 'ClaudeBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'Claude-User', allow: '/', disallow: PRIVATE },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'anthropic-ai', allow: '/', disallow: PRIVATE },
      // Perplexity
      { userAgent: 'PerplexityBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'Perplexity-User', allow: '/', disallow: PRIVATE },
      // Google / 기타 학습·검색
      { userAgent: 'Google-Extended', allow: '/', disallow: PRIVATE },
      { userAgent: 'GoogleOther', allow: '/', disallow: PRIVATE },
      { userAgent: 'CCBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'Amazonbot', allow: '/', disallow: PRIVATE },
      { userAgent: 'Meta-ExternalAgent', allow: '/', disallow: PRIVATE },
      // 네이버(Yeti)·구글·빙 등 일반 검색엔진
      { userAgent: '*', allow: '/', disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
