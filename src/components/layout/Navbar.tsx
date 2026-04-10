'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, Phone, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/', label: 'Inicio' },
  {
    href: '/empresa',
    label: 'Empresa',
    children: [
      { href: '/empresa', label: 'Nosotros' },
      { href: '/empresa#mision', label: 'Misión y Visión' },
    ],
  },
  { href: '/productos', label: 'Productos' },
  { href: '/pintame', label: '🎨 Píntame' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-saona-navy shadow-lg shadow-black/20' : 'bg-saona-navy'
      )}
    >


      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <span className="text-saona-blue font-black text-sm">S</span>
            </div>
            <span className="text-white font-black text-xl tracking-wide uppercase">
              SAONA
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.href} className="relative">
                  <button
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="flex items-center gap-1 text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {activeDropdown === link.label && (
                    <div
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 bg-white rounded-lg shadow-xl py-2 min-w-40 border border-gray-100"
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
                    'px-3 py-2 text-sm font-medium transition-colors rounded',
                    link.label === '🎨 Píntame'
                      ? 'text-white bg-saona-blue hover:bg-saona-blue-dark'
                      : 'text-white/90 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white/70 hover:text-white transition-colors p-2"
            >
              <Search className="w-4 h-4" />
            </button>
            <a
              href="tel:+51981272614"
              className="flex items-center gap-1 text-white/80 hover:text-white text-sm transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>+51 981 272 614</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 pt-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                autoFocus
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-saona-navy-light border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10">
              <a
                href="tel:+51981272614"
                className="flex items-center gap-2 text-white/70 text-sm px-3 py-2"
              >
                <Phone className="w-4 h-4" />
                +51 981 272 614
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
