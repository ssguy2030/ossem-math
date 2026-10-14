import Link from '@tiptap/extension-link';
import { INTERNAL_HREF } from './site';

// 내부 링크(사이트 상대경로, #앵커, 자기 도메인)와 외부 링크를 구분해서 rel/target을 렌더한다.
// - 내부 링크: rel="nofollow"·target="_blank"를 붙이지 않는다. (랭킹 신호 전달)
// - 외부 링크: 새 탭 + rel="noopener noreferrer nofollow"
export const SmartLink = Link.extend({
  renderHTML({ HTMLAttributes }) {
    const href = typeof HTMLAttributes.href === 'string' ? HTMLAttributes.href : '';
    const attrs: Record<string, unknown> = { ...this.options.HTMLAttributes, ...HTMLAttributes };
    if (INTERNAL_HREF.test(href)) {
      delete attrs.rel;
      delete attrs.target;
    } else {
      attrs.rel = 'noopener noreferrer nofollow';
      attrs.target = '_blank';
    }
    return ['a', attrs, 0];
  },
});
