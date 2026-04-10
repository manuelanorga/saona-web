'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/', label: 'Inicio', exact: true },
  {
    href: '/empresa',
    label: 'Empresa',
    children: [
      { href: '/empresa', label: 'Nosotros' },
      { href: '/empresa#mision', label: 'Misión y Visión' },
    ],
  },
  { href: '/productos', label: 'Productos' },
  { href: '/contacto', label: 'Contacto' },
];

const whatsappUrl = 'https://wa.me/51981272614?text=Hola, quisiera cotizar algunos productos SAONA.';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={clsx(
          'mx-auto max-w-6xl transition-all duration-500 rounded-2xl px-4 py-2.5',
          scrolled
            ? 'bg-saona-navy/95 backdrop-blur-md border border-white/8 shadow-2xl shadow-black/40'
            : 'bg-transparent border border-transparent'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-2">
            <div className="w-8 h-8 bg-saona-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M7 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-7h-1V5c0-1.1-.9-2-2-2H4C2.9 3 2 3.9 2 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h1c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1z"/>
              </svg>
            </div>
            <span className="text-white font-black text-base tracking-widest uppercase drop-shadow-md">
              SAONA
            </span>
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-white/20 mx-1" />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.href} className="relative">
                  <button
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={clsx(
                      'flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-all',
                      isActive(link.href)
                        ? 'bg-white/15 text-white font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {activeDropdown === link.label && (
                    <div
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl py-2 min-w-40 border border-gray-100 z-50"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-saona-blue"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'px-3 py-2 rounded-xl text-sm transition-all',
                    isActive(link.href, link.exact)
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Píntame */}
            <Link
              href="/pintame"
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all border',
                isActive('/pintame')
                  ? 'bg-saona-blue/40 border-saona-blue/60 text-blue-200'
                  : 'bg-saona-blue/20 border-saona-blue/40 text-blue-200 hover:bg-saona-blue/30'
              )}
            >
              🎨 Píntame
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            <a
              href="tel:+51981272614"
              className="hidden lg:flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors"
            >
              <Phone className="w-3 h-3" />
              +51 981 272 614
            </a>

            {/* Cotiza — siempre visible */}
            <a
              href={whatsappUrl}
              target="_blank"
              className="flex items-center gap-1.5 bg-saona-green hover:bg-saona-green-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/20 flex-shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Cotiza aquí</span>
            </a>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 bg-saona-navy/95 backdrop-blur-md rounded-xl p-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive(link.href, link.exact)
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/pintame"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-300 bg-saona-blue/20 border border-saona-blue/30"
              >
                🎨 Píntame
              </Link>
              <a
                href="tel:+51981272614"
                className="flex items-center gap-2 px-3 py-2 text-white/40 text-sm mt-1 border-t border-white/8 pt-3"
              >
                <Phone className="w-4 h-4" />
                +51 981 272 614
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
