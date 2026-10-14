import sanitizeHtml from 'sanitize-html';
import { INTERNAL_HREF } from './site';

/** 서버에서 미리 sanitize → AI 크롤러가 본문 전체를 읽을 수 있음 */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'h1', 'h2', 'h3', 'u', 'span']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'style', 'class'],
      iframe: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
      a: ['href', 'target', 'rel'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
      '*': ['class', 'style'],
    },
    allowedSchemes: ['http', 'https'],
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com'],
    textFilter: (text) => text.replace(/&nbsp;/g, ' '),
    transformTags: {
      // 내부 링크에는 nofollow·새 탭을 빼서 내부 링크 신호가 전달되도록 한다.
      a: (tagName, attribs) => {
        if (!INTERNAL_HREF.test(attribs.href || '')) return { tagName, attribs };
        const rest = { ...attribs };
        delete rest.target;
        delete rest.rel;
        return { tagName, attribs: rest };
      },
    },
  });
}

/** H2가 '?'로 끝나면 질문, 바로 뒤 첫 문단을 답으로 보고 FAQ를 뽑는다. */
export function extractFaq(html: string): { q: string; a: string }[] {
  const blocks: { type: 'h2' | 'p'; text: string; index: number }[] = [];
  const strip = (s: string) => s.replace(/<[^>]+>/g, '').trim();
  for (const m of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)) {
    const text = strip(m[1]);
    if (text) blocks.push({ type: 'h2', text, index: m.index ?? 0 });
  }
  for (const m of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = strip(m[1]);
    if (text) blocks.push({ type: 'p', text, index: m.index ?? 0 });
  }
  blocks.sort((a, b) => a.index - b.index);

  const faqs: { q: string; a: string }[] = [];
  blocks.forEach((b, i) => {
    if (b.type !== 'h2' || !b.text.endsWith('?')) return;
    for (let j = i + 1; j < blocks.length && blocks[j].type !== 'h2'; j++) {
      if (blocks[j].text.length > 10) {
        faqs.push({ q: b.text, a: blocks[j].text });
        break;
      }
    }
  });
  return faqs;
}

/** 본문 HTML에서 요약 텍스트 (description 폴백용) */
export const htmlToText = (html: string, max = 120) =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
