'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX, FiChevronDown, FiExternalLink } from 'react-icons/fi';
import { NAV, type NavItem } from '../lib/nav';

function ItemLink({ item, className, onClick }: { item: NavItem; className: string; onClick?: () => void }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {item.label} <FiExternalLink size={12} className="inline -mt-0.5" aria-hidden />
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const isActive = (item: NavItem) =>
    pathname === item.href || item.children?.some((c) => !c.external && pathname.startsWith(c.href));
  const close = () => {
    setIsOpen(false);
    setOpenGroup(null);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-baseline gap-1.5" onClick={close}>
            <span className="text-2xl font-extrabold text-brand-primary tracking-tight">
              오쌤수학<span className="text-brand-accent">.</span>
            </span>
            <span className="hidden sm:inline text-xs text-gray-500">김천 율곡동</span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 py-2 font-medium ${isActive(item) ? 'text-brand-primary' : 'text-gray-700 hover:text-brand-primary'}`}
                  >
                    {item.label}
                    <FiChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </Link>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible
                               group-hover:opacity-100 group-hover:visible
                               focus-within:opacity-100 focus-within:visible transition-all duration-150"
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-40">
                      {item.children.map((child) => (
                        <ItemLink
                          key={child.href}
                          item={child}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-brand-soft hover:text-brand-primary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-medium ${isActive(item) ? 'text-brand-primary' : 'text-gray-700 hover:text-brand-primary'}`}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href="/about/location#contact"
              className="bg-brand-accent hover:bg-brand-accent-hover text-brand-dark px-5 py-2 rounded-lg font-bold transition-colors"
            >
              상담 문의
            </Link>
          </div>

          {/* 모바일 */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/about/location#contact"
              onClick={close}
              className="inline-flex items-center min-h-[44px] bg-brand-accent text-brand-dark text-sm px-4 rounded-lg font-bold"
            >
              상담 문의
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isOpen}
              className="p-2 text-gray-700"
            >
              {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                    aria-expanded={openGroup === item.label}
                    className="w-full flex items-center justify-between py-3 font-medium text-gray-800"
                  >
                    {item.label}
                    <FiChevronDown className={`transition-transform ${openGroup === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openGroup === item.label && (
                    <div className="pl-4 pb-2 space-y-1">
                      {item.children.map((child) => (
                        <ItemLink key={child.href} item={child} onClick={close} className="block py-2 text-gray-600" />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} href={item.href} onClick={close} className="block py-3 font-medium text-gray-800">
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
