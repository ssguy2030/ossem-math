import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-gray-50 min-h-screen">{children}</div>;
}
