// 학원 기본 정보의 단일 출처.
// 상호·주소·전화·교습비가 바뀌면 이 파일만 고치면 화면·푸터·JSON-LD가 함께 갱신된다.

// 사이트 기준 주소 — sitemap·canonical·robots·JSON-LD·RSS 모두 이 값을 쓴다.
// 도메인을 구입하면 이 한 줄만 바꾸고 Vercel에 도메인을 연결하면 된다.
export const SITE_URL = 'https://ossem-math.vercel.app';

export const BRAND = '오쌤수학'; // title 접미사
export const ACADEMY_NAME = '오쌤수학학원';

export const ACADEMY = {
  name: ACADEMY_NAME,
  phone: '0507-1373-1231',
  address: '경북 김천시 혁신4로 61 4층 402호',
  addressParts: {
    streetAddress: '혁신4로 61 4층 402호',
    addressLocality: '김천시',
    addressRegion: '경상북도',
    neighborhood: '율곡동',
    addressCountry: 'KR',
  },
  registrationNo: '제530호',
  subject: '수학',
  hours: { weekdays: '평일 13:00 ~ 23:00', closed: '토·일요일 휴무' },
  classSize: '한 반 6~8명',
  avgStay: '5년 6개월',
  years: 20,
  /** 원장 경력: 학습지 2년 → 과외 2년 → 교습소(지좌동) 10년 → 혁신도시 학원 */
  career: ['학습지 2년', '과외 2년', '교습소 10년', '혁신도시 오쌤수학학원'],
  /** 제자 진학 대학 (원장 블로그 공개 내용) */
  alumniUniversities: ['서울대', '연세대', '고려대', '이화여대', '단국대'],
  slogan: '성실함의 끝은 늘 해피엔딩',
} as const;

export const TUITION = [
  { grade: '초등부', course: '초등수학', fee: 220000 },
  { grade: '중등부', course: '중등수학', fee: 270000 },
  { grade: '고등부', course: '고등수학', fee: 370000 },
] as const;

export const formatWon = (n: number) => `${(n / 10000).toLocaleString('ko-KR')}만원`;

export const SNS = {
  instagram: 'https://www.instagram.com/ossemsuhak',
  blog: 'https://blog.naver.com/ossem0912',
  naverMap: 'https://naver.me/xTsgNb8R',
} as const;

const SITE_HOST = new URL(SITE_URL).hostname.replace(/^www\./, '').replace(/\./g, '\\.');
/** 내부 링크 판별 (상대경로·#앵커·자기 도메인) */
export const INTERNAL_HREF = new RegExp(`^(\\/|#)|^https?:\\/\\/(www\\.)?${SITE_HOST}`, 'i');

/** 절대 URL. 한글 경로는 퍼센트 인코딩해서 sitemap·canonical·RSS에 쓴다. */
export const absUrl = (path = '/') => encodeURI(`${SITE_URL}${path === '/' ? '' : path}`);
