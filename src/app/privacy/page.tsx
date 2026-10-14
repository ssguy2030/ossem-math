import type { Metadata } from 'next';
import PageHeader from '../components/PageHeader';
import { ACADEMY } from '../lib/site';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: `${ACADEMY.name} 홈페이지 개인정보처리방침`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader crumbs={[['개인정보처리방침', '/privacy']]} title="개인정보처리방침" />
      <div className="max-w-3xl mx-auto px-4 py-14 prose">
        <p>
          {ACADEMY.name}(이하 &quot;학원&quot;)은 홈페이지 이용자의 개인정보를 소중히 다루며 「개인정보 보호법」을
          준수합니다.
        </p>
        <h2>1. 수집하는 개인정보</h2>
        <p>
          이 홈페이지는 회원가입이나 온라인 문의 양식을 운영하지 않으며, 방문자의 개인정보를 직접 수집하지 않습니다.
          상담은 전화({ACADEMY.phone})로만 받습니다.
        </p>
        <h2>2. 자동 수집 정보</h2>
        <p>
          서비스 운영과 통계 분석을 위해 접속 기록, 브라우저 종류, 방문 페이지 등 개인을 식별할 수 없는 정보가 자동으로
          수집될 수 있습니다.
        </p>
        <h2>3. 개인정보 보호책임자</h2>
        <p>
          {ACADEMY.name} · 전화 {ACADEMY.phone} · {ACADEMY.address}
        </p>
        <h2>4. 시행일</h2>
        <p>이 방침은 2026년 10월 14일부터 적용됩니다.</p>
      </div>
    </>
  );
}
