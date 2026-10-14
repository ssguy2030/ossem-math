// 칼럼 카테고리(학교별).
// DB의 posts.category 값과 1:1로 맞춘다. 학교를 추가하려면 여기에 한 줄 넣으면
// 목록·카테고리 페이지·sitemap·글쓰기 화면이 함께 늘어난다.

export type Grade = 'elementary' | 'middle' | 'high';

export interface ColumnCategory {
  slug: string;
  name: string;
  grade: Grade;
  /** 카테고리 페이지 title (뒤에 "| 오쌤수학"이 붙는다) */
  title: string;
  description: string;
}

export const COLUMN_CATEGORIES: ColumnCategory[] = [
  {
    slug: 'elementary',
    name: '초등부',
    grade: 'elementary',
    title: '초등 수학 학습가이드',
    description:
      '율곡초·운곡초·농소초 등 김천 초등학생이 자주 막히는 구구단·분수·소수 단원을 오쌤이 짚어 드립니다. 집에서 바로 확인할 수 있는 초등 수학 학습가이드.',
  },
  {
    slug: 'yulgok-middle',
    name: '율곡중',
    grade: 'middle',
    title: '율곡중 수학 시험분석',
    description:
      '김천 율곡중학교 학년별 중간·기말고사 수학 일정, 시험범위, 출제 경향을 오쌤수학학원이 분석합니다.',
  },
  {
    slug: 'unnam-middle',
    name: '운남중',
    grade: 'middle',
    title: '운남중 수학 시험분석',
    description:
      '김천 운남중학교 학년별 중간·기말고사 수학 일정, 시험범위, 출제 경향을 오쌤수학학원이 분석합니다.',
  },
  {
    slug: 'yulgok-high',
    name: '율곡고',
    grade: 'high',
    title: '율곡고 수학 내신분석',
    description:
      '김천 율곡고등학교 수학 내신 시험범위와 출제 경향, 등급 관리 방법을 오쌤수학학원이 분석합니다.',
  },
  {
    slug: 'jungang-high',
    name: '김천중앙고',
    grade: 'high',
    title: '김천중앙고 수학 내신분석',
    description:
      '김천중앙고등학교 수학 내신 시험범위와 출제 경향, 등급 관리 방법을 오쌤수학학원이 분석합니다.',
  },
];

export const getCategory = (slug: string) => COLUMN_CATEGORIES.find((c) => c.slug === slug);
export const categoriesByGrade = (grade: Grade) => COLUMN_CATEGORIES.filter((c) => c.grade === grade);
