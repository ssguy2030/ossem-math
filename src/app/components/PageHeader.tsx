import Link from 'next/link';

/** 하위 페이지 상단: 화면용 브레드크럼 + H1 + 리드 문장 */
export default function PageHeader({
  crumbs,
  title,
  lead,
}: {
  crumbs: [string, string][];
  title: string;
  lead?: string;
}) {
  return (
    <header className="bg-brand-soft">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <nav aria-label="현재 위치" className="text-sm text-gray-500 mb-4">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-brand-primary">홈</Link>
            </li>
            {crumbs.map(([name, href], i) => (
              <li key={`${i}-${href}`} className="flex items-center gap-1">
                <span aria-hidden>›</span>
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-gray-700">{name}</span>
                ) : (
                  <Link href={href} className="hover:text-brand-primary">{name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{title}</h1>
        {lead && <p className="mt-4 text-lg text-gray-600 max-w-3xl leading-relaxed">{lead}</p>}
      </div>
    </header>
  );
}
