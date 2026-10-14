import { postPath, type PostSummary } from '../lib/posts';
import { breadcrumb } from '../lib/schema';
import { absUrl } from '../lib/site';
import JsonLd from './JsonLd';

/** 목록 페이지: BreadcrumbList + ItemList */
export default function ListSchema({
  crumbs,
  name,
  posts,
}: {
  crumbs: [string, string][];
  name: string;
  posts: PostSummary[];
}) {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: absUrl(crumbs[crumbs.length - 1][1]),
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: absUrl(postPath(p)),
    })),
  };
  return <JsonLd data={[breadcrumb(crumbs), itemList]} />;
}
