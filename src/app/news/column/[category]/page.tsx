import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryTabs from '../../../components/CategoryTabs';
import ListSchema from '../../../components/ListSchema';
import PageHeader from '../../../components/PageHeader';
import { PostCards } from '../../../components/PostCards';
import { COLUMN_CATEGORIES, getCategory } from '../../../lib/categories';
import { listPosts } from '../../../lib/posts';

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return COLUMN_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).category);
  if (!cat) return {};
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `/news/column/${cat.slug}` },
  };
}

export default async function ColumnCategoryPage({ params }: Props) {
  const cat = getCategory((await params).category);
  if (!cat) notFound();
  const posts = await listPosts('column', { category: cat.slug });
  const crumbs: [string, string][] = [
    ['칼럼', '/news/column'],
    [cat.name, `/news/column/${cat.slug}`],
  ];
  return (
    <>
      <ListSchema crumbs={crumbs} name={`오쌤수학 ${cat.title}`} posts={posts} />
      <PageHeader crumbs={crumbs} title={cat.title} lead={cat.description} />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <CategoryTabs active={cat.slug} />
        <PostCards posts={posts} empty={`${cat.name} 칼럼이 곧 올라옵니다.`} />
      </div>
    </>
  );
}
