import Link from 'next/link';
import { COLUMN_CATEGORIES } from '../lib/categories';

export default function CategoryTabs({ active }: { active?: string }) {
  const tabs: [string, string, string | undefined][] = [
    ['전체', '/news/column', undefined],
    ...COLUMN_CATEGORIES.map((c) => [c.name, `/news/column/${c.slug}`, c.slug] as [string, string, string]),
  ];
  return (
    <nav aria-label="칼럼 카테고리" className="flex flex-wrap gap-2 mb-8">
      {tabs.map(([name, href, slug]) => (
        <Link
          key={href}
          href={href}
          aria-current={active === slug ? 'page' : undefined}
          className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
            active === slug
              ? 'bg-brand-primary border-brand-primary text-white'
              : 'border-gray-300 text-gray-700 hover:border-brand-primary hover:text-brand-primary'
          }`}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
