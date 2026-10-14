import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <p className="text-6xl font-extrabold text-brand-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-gray-600">주소가 바뀌었거나 삭제된 글일 수 있습니다.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-lg bg-brand-primary px-5 py-3 font-bold text-white">홈으로</Link>
        <Link href="/news/column" className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-700">칼럼 보기</Link>
      </div>
    </div>
  );
}
