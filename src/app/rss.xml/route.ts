import { listAllPublished, postPath } from '../lib/posts';
import { ACADEMY_NAME, BRAND, absUrl } from '../lib/site';

// 1시간마다 재생성 — 네이버 서치어드바이저에 RSS로 제출한다.
export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const posts = await listAllPublished();
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(BRAND)} 소식·칼럼</title>
    <link>${absUrl('/')}</link>
    <description>김천 율곡동 ${esc(ACADEMY_NAME)}의 공지사항, 학교별 수학 칼럼, 수강 후기</description>
    <language>ko</language>
    ${posts
      .map(
        (p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${absUrl(postPath(p))}</link>
      <guid>${absUrl(postPath(p))}</guid>
      <description>${esc(p.summary)}</description>${
        p.type === 'review' ? '' : `\n      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>`
      }
    </item>`,
      )
      .join('')}
  </channel>
</rss>`;
  return new Response(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
