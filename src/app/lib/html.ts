import sanitizeHtml from 'sanitize-html';
import { INTERNAL_HREF } from './site';

// 인라인 style은 에디터가 실제로 쓰는 속성만 허용 (화면을 덮는 position·배경이미지 등 차단)
const SAFE_COLOR = [/^#[0-9a-f]{3,8}$/i, /^rgba?\(\s*[\d.\s,%]+\)$/i];
const SAFE_LENGTH = [/^\d+(\.\d+)?(px|%|em|rem)?$/, /^auto$/];

/** 서버에서 미리 sanitize → AI 크롤러가 본문 전체를 읽을 수 있음 */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'h1', 'h2', 'h3', 'u', 'span']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'style', 'class'],
      iframe: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
      a: ['href', 'target', 'rel'],
      td: ['colspan', 'rowspan', 'style'],
      th: ['colspan', 'rowspan', 'style'],
      p: ['style'],
      h1: ['style'],
      h2: ['style'],
      h3: ['style'],
      span: ['style'],
    },
    allowedClasses: { img: ['editor-image'] },
    allowedStyles: {
      '*': {
        'text-align': [/^(left|right|center|justify)$/],
        color: SAFE_COLOR,
      },
      img: {
        display: [/^block$/],
        margin: [/^[\d\sa-z%.]+$/i],
        'margin-left': SAFE_LENGTH,
        'margin-right': SAFE_LENGTH,
        width: SAFE_LENGTH,
        height: SAFE_LENGTH,
      },
      td: { width: SAFE_LENGTH },
      th: { width: SAFE_LENGTH },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['https', 'http'], iframe: ['https'] },
    allowProtocolRelative: false,
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com'],
    textFilter: (text) => text.replace(/&nbsp;/g, ' '),
    transformTags: {
      a: (tagName, attribs) => {
        // 내부 링크: nofollow·새 탭을 빼서 내부 링크 신호가 전달되도록 한다.
        if (INTERNAL_HREF.test(attribs.href || '')) {
          const rest = { ...attribs };
          delete rest.target;
          delete rest.rel;
          return { tagName, attribs: rest };
        }
        // 외부 링크: 새 탭 + opener 차단(탭내빙 방지)
        return { tagName, attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer nofollow' } };
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
