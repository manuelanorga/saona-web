'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Palette, Image as ImageIcon,
  MessageSquare, Settings, LogOut, Menu, X, ChevronRight,
  Eye
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Package },
  { href: '/admin/colores', label: 'Paleta de Colores', icon: Palette },
  { href: '/admin/ambientes', label: 'Ambientes Simulador', icon: ImageIcon },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const ok = sessionStorage.getItem('saona_admin');
    if (ok === 'true') setAuthed(true);
  }, []);

  const login = () => {
    // Simple password check - in production use proper auth
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASS || 'saona2025admin')) {
      sessionStorage.setItem('saona_admin', 'true');
      setAuthed(true);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('saona_admin');
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-saona-navy flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-saona-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-2xl">S</span>
            </div>
            <h1 className="font-black text-saona-navy text-2xl">Panel Admin</h1>
            <p className="text-gray-500 text-sm mt-1">SAONA CMS</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Contraseña"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              onClick={login}
              className="w-full bg-saona-blue text-white font-bold py-3 rounded-xl hover:bg-saona-blue-dark transition-colors"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-saona-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <div>
            <p className="font-black text-saona-navy text-sm">SAONA CMS</p>
            <p className="text-xs text-gray-400">Panel de control</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  active ? 'bg-saona-blue/10 text-saona-blue' : 'text-gray-600'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-saona-blue hover:bg-saona-blue/5"
          >
            <Eye className="w-4 h-4" />
            Ver sitio
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-gray-800 text-sm capitalize">
              {pathname.split('/').filter(Boolean).join(' › ')}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
