import { SNS } from './site';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

// 상단 메뉴의 단일 출처 (데스크탑 드롭다운·모바일 메뉴·푸터 사이트맵 공용)
export const NAV: NavItem[] = [
  {
    label: '학원소개',
    href: '/about/philosophy',
    children: [
      { label: '교육철학', href: '/about/philosophy' },
      { label: '교습비 안내', href: '/about/tuition' },
      { label: '오시는 길', href: '/about/location' },
    ],
  },
  {
    label: '수업안내',
    href: '/classes',
    children: [
      { label: '초등부', href: '/classes/elementary' },
      { label: '중등부', href: '/classes/middle' },
      { label: '고등부', href: '/classes/high' },
    ],
  },
  { label: '후기', href: '/review' },
  {
    label: '소식',
    href: '/news/notice',
    children: [
      { label: '공지사항', href: '/news/notice' },
      { label: '칼럼', href: '/news/column' },
      { label: '네이버 블로그', href: SNS.blog, external: true },
    ],
  },
];
