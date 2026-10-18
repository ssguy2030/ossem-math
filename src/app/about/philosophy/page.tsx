import type { Metadata } from 'next';
import ContactCta from '../../components/ContactCta';
import JsonLd from '../../components/JsonLd';
import PageHeader from '../../components/PageHeader';
import { academyRef, breadcrumb } from '../../lib/schema';
import { ACADEMY, absUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '교육철학',
  description: `김천에서 ${ACADEMY.years}년째 수학을 가르치는 오쌤수학학원의 교육철학. 아이와의 호흡, 맨투맨 퀘스천 수업, 문제풀이보다 개념이해, 꼼꼼한 피드백. 평균 등원 기간 ${ACADEMY.avgStay}.`,
  alternates: { canonical: '/about/philosophy' },
};

// 출처: 원장 블로그 「[공지] 안녕하세요. 오쌤수학학원 원장 오쌤입니다. [교육철학]」 외
const principles = [
  {
    title: '맨투맨 퀘스천 수업',
    sub: 'Men to men question',
    body: '10년 넘게 지켜 온 오쌤만의 수업 방식입니다. 학년별로 질문을 받기도 하지만, 학생 한 명이 선생님에게 직접 1:1로 질문하는 대화가 훨씬 많습니다. 학생마다 수준과 범위, 수학을 해석하는 능력이 달라서 그 학생에게 맞게 설명해야 따라옵니다. 학습 편차가 커진 요즘은 개별 맞춤이 필수라, 중고등학생은 개별 질문과 개별 오답풀이를 합니다.',
  },
  {
    title: '문제풀이보다 개념이해',
    sub: '오늘 배운 건 오늘 알고 가게',
    body: '"김천에서 수학을 제일 꼼꼼하게 가르친다" 소개받고 오시는 어머님들께 자주 듣는 말입니다. 설령 내일 잊어버릴지라도 오늘 배운 건 꼭 오늘 알고 가게 합니다. 기본 개념을 이해해야 응용도 가능하기 때문에, 개념을 이해하지 못한 학생에게는 풀이보다 이해 형식의 개념 수업에 더 신경을 씁니다. 같은 문제도 미리 여러 방법으로 풀어 보고 수업합니다. A 방법으로 이해하는 아이가 있고, B 방법으로 이해하는 아이가 있기 때문입니다.',
  },
  {
    title: '꼼꼼한 피드백',
    sub: '학부모님이 안심하실 수 있도록',
    body: '학부모님은 모든 수업을 볼 수 없고, 사춘기 아이들은 학원 이야기를 잘 하지 않습니다. 그래서 아이의 현재 상황과 앞으로의 계획을 개별로 자세히 전해 드립니다. 시험 대비 기간에는 전화로 20~30분씩 이야기를 나누기도 합니다. 수업 준비 시간을 쪼개서 하는 일이지만, 피드백을 확실히 해야 학부모님도 저희를 믿으실 수 있으니까요.',
  },
];

export default function PhilosophyPage() {
  const aboutPage = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: '오쌤수학학원 교육철학',
    url: absUrl('/about/philosophy'),
    mainEntity: academyRef,
  };
  return (
    <>
      <JsonLd data={[breadcrumb([['학원소개', '/about/philosophy'], ['교육철학', '/about/philosophy']]), aboutPage]} />
      <PageHeader
        crumbs={[['학원소개', '/about/philosophy'], ['교육철학', '/about/philosophy']]}
        title="아이와의 호흡을 가장 중요하게 생각합니다"
        lead={`김천에서 ${ACADEMY.years}년째 아이들 수학을 가르치는 오쌤수학학원 원장, 오쌤입니다. 학습지에서 시작해 과외, 교습소를 거쳐 혁신도시의 지금 학원까지 수많은 학생들을 만나 왔습니다.`}
      />

      <div className="max-w-4xl mx-auto px-4 py-14 space-y-16">
        {/* 경력 */}
        <section aria-labelledby="career">
          <h2 id="career" className="sr-only">원장 경력</h2>
          <ol className="flex flex-wrap items-center gap-2 text-sm md:text-base">
            {ACADEMY.career.map((c, i) => (
              <li key={c} className="flex items-center gap-2">
                <span className="rounded-full bg-brand-soft px-4 py-2 font-semibold text-brand-dark">{c}</span>
                {i < ACADEMY.career.length - 1 && <span className="text-gray-400" aria-hidden>→</span>}
              </li>
            ))}
          </ol>
        </section>

        {/* 호흡 */}
        <section aria-labelledby="breath" className="space-y-4 text-gray-700 leading-relaxed text-lg">
          <h2 id="breath" className="text-2xl md:text-3xl font-bold text-gray-900">수학은 장거리 달리기입니다</h2>
          <p>
            수학은 다른 과목과 달리, 특히 초등 5학년부터 연계성이 강하고 고3까지 길게 봐야 하는 장거리 달리기입니다. 그래서
            선생님과 아이의 호흡이 더 중요합니다. 긴 호흡을 함께한 아이들의 결과는 늘 좋았습니다. 특히 초·중학교 때 들어와
            고등학교까지 쭉 함께한 친구들이 그랬습니다.
          </p>
          <p>
            아무리 비싸고 좋은 음식도 내 몸에 맞지 않으면 소용없듯, 아무리 유명한 학원이라도 아이와 맞지 않으면 성적이 오르지
            않습니다. 한 반의 학생 수가 적을수록 선생님의 영향은 더 커집니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="rounded-2xl bg-brand-soft p-6">
              <p className="text-3xl font-extrabold text-brand-primary">{ACADEMY.avgStay}</p>
              <p className="mt-1 text-base text-gray-700">
                오쌤수학 평균 등원 기간. 대부분의 학원이 2년 남짓인 것과 비교하면 꽤 오래 다니는 편입니다. 가장 오래 다닌
                학생은 초등학생 때부터 고등학교까지 10년 넘게 함께했습니다.
              </p>
            </div>
            <div className="rounded-2xl bg-brand-soft p-6">
              <p className="text-xl font-extrabold text-brand-primary">{ACADEMY.alumniUniversities.join(' · ')}</p>
              <p className="mt-1 text-base text-gray-700">
                유치부·초등·중1 때 처음 오쌤수학에 와서 긴 호흡을 함께한 제자들이 진학한 대학입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3원칙 */}
        <section aria-labelledby="principles">
          <h2 id="principles" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">오쌤수학의 3가지 원칙</h2>
          <ol className="space-y-10">
            {principles.map((p, i) => (
              <li key={p.title} className="flex gap-5">
                <span className="text-4xl font-extrabold text-brand-primary/30 leading-none w-10 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">{p.title}</h3>
                  <p className="text-sm font-semibold text-brand-primary mt-1">{p.sub}</p>
                  <p className="mt-3 text-gray-700 leading-relaxed">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 성실함 */}
        <section aria-labelledby="sincerity" className="rounded-3xl bg-brand-dark text-white p-8 md:p-10">
          <h2 id="sincerity" className="text-2xl md:text-3xl font-bold">&ldquo;{ACADEMY.slogan}&rdquo;</h2>
          <div className="mt-4 space-y-4 text-blue-50 leading-relaxed">
            <p>
              중1 때부터 함께한 한 학생은 수학머리를 타고나지 않았습니다. 저는 솔직하게 말했습니다. 수학에 탁월한 친구들이
              1시간 할 공부를 2시간은 해야 따라갈 수 있다고요. 그 친구는 그 말을 받아들였고, 문과였지만 수학 내신 1등급을
              끝까지 지켜 연세대에 합격했습니다.
            </p>
            <p>
              수학머리가 없다고 미리 겁먹고 포기하는 경우가 있습니다. 하지만 성실히 숙제를 하고 꾸준히 노력한 친구들은 항상
              성적이 올랐고, 원하는 학교에 진학했습니다. 그래서 오쌤수학은 포기하지 않습니다.
            </p>
          </div>
        </section>
      </div>

      <ContactCta />
    </>
  );
}
