// 사이트 전역 JSON-LD(학원 엔티티)의 단일 출처.
//
// - `academyNode`: EducationalOrganization + LocalBusiness 노드. 루트 레이아웃에서
//   모든 페이지에 1회 렌더한다. (AI 크롤러가 깊은 페이지에 바로 들어와도 학원
//   정보를 읽을 수 있도록 전역 유지)
// - `academyRef`: 위 노드를 가리키는 참조 stub. Article.publisher, Course.provider
//   등에서 `{ '@id': ... }` 로 연결해 엔티티를 하나로 통합한다.

import { ACADEMY, ACADEMY_NAME, BRAND, SITE_URL, SNS, TUITION, absUrl } from './site';

export const ACADEMY_ID = `${SITE_URL}/#academy`;

export const websiteNode = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: BRAND,
  alternateName: [ACADEMY_NAME, '김천 오쌤수학학원'],
  url: `${SITE_URL}/`,
  inLanguage: 'ko-KR',
  publisher: { '@id': ACADEMY_ID },
};

export const academyRef = { '@id': ACADEMY_ID } as const;

export const academyNode = {
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': ACADEMY_ID,
  name: ACADEMY_NAME,
  alternateName: [BRAND, '오쌤수학학원 김천율곡본원'],
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  telephone: ACADEMY.phone,
  description: `김천 율곡동(혁신도시) 초·중·고 수학 전문학원. ${ACADEMY.classSize} 소수정예, 학생이 선생님에게 1:1로 질문하는 맨투맨 퀘스천 수업, 문제풀이보다 개념이해. 김천에서 ${ACADEMY.years}년째 수학을 가르친 원장 오쌤이 운영하며 평균 등원 기간은 ${ACADEMY.avgStay}입니다.`,
  slogan: ACADEMY.slogan,
  priceRange: '₩220,000~₩370,000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: ACADEMY.addressParts.streetAddress,
    addressLocality: ACADEMY.addressParts.addressLocality,
    addressRegion: ACADEMY.addressParts.addressRegion,
    addressCountry: ACADEMY.addressParts.addressCountry,
  },
  areaServed: [
    { '@type': 'City', name: '김천시' },
    { '@type': 'Place', name: '김천 율곡동' },
    { '@type': 'Place', name: '김천혁신도시' },
  ],
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
    audienceType: '초등학생, 중학생, 고등학생',
  },
  knowsAbout: ['초등수학', '중등수학', '고등수학', '수학 내신', '수능 수학'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '13:00',
      closes: '23:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '수학 교습과정',
    itemListElement: TUITION.map((t) => ({
      '@type': 'Offer',
      price: t.fee,
      priceCurrency: 'KRW',
      itemOffered: { '@type': 'Course', name: t.course, provider: { '@id': ACADEMY_ID } },
    })),
  },
  identifier: { '@type': 'PropertyValue', name: '학원등록번호', value: ACADEMY.registrationNo },
  sameAs: [SNS.blog, SNS.instagram, 'https://ossem0912.tistory.com'],
};

/** 하위 페이지 BreadcrumbList. items: [이름, 경로] — 홈은 자동으로 앞에 붙는다. */
export function breadcrumb(items: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['홈', '/'] as [string, string], ...items].map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absUrl(path),
    })),
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
