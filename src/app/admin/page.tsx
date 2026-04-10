import { createAdminClient } from '@/lib/supabase';
import Link from 'next/link';
import { Package, Palette, MessageSquare, Image, ArrowRight } from 'lucide-react';

export default async function AdminDashboard() {
  let productsCount = 0;
  let messagesCount = 0;
  let colorsCount = 0;
  let envsCount = 0;

  try {
    const admin = createAdminClient();
    const [products, messages, colors, envs] = await Promise.all([
      admin.from('products').select('id', { count: 'exact', head: true }),
      admin.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
      admin.from('colors').select('id', { count: 'exact', head: true }),
      admin.from('environments').select('id', { count: 'exact', head: true }),
    ]);
    productsCount = products.count ?? 0;
    messagesCount = messages.count ?? 0;
    colorsCount = colors.count ?? 0;
    envsCount = envs.count ?? 0;
  } catch (e) {}

  const stats = [
    { label: 'Productos', value: productsCount, icon: Package, href: '/admin/productos', color: 'bg-blue-500' },
    { label: 'Mensajes sin leer', value: messagesCount, icon: MessageSquare, href: '/admin/mensajes', color: 'bg-amber-500' },
    { label: 'Colores en paleta', value: colorsCount, icon: Palette, href: '/admin/colores', color: 'bg-purple-500' },
    { label: 'Ambientes simulador', value: envsCount, icon: Image, href: '/admin/ambientes', color: 'bg-teal-500' },
  ];

  const quickActions = [
    { href: '/admin/productos/nuevo', label: 'Agregar producto', desc: 'Crear nuevo producto en el catálogo', icon: Package },
    { href: '/admin/colores', label: 'Gestionar colores', desc: 'Administrar paleta del simulador', icon: Palette },
    { href: '/admin/ambientes', label: 'Gestionar ambientes', desc: 'Fotos del simulador de pintado', icon: Image },
    { href: '/admin/mensajes', label: 'Ver mensajes', desc: 'Consultas recibidas de clientes', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenido al panel de administración de SAONA</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-black text-2xl text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </Link>
        ))}
      </div>
      <div>
        <h2 className="font-bold text-gray-800 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map(({ href, label, desc, icon: Icon }) => (
            <Link key={href} href={href} className="bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all group border-2 border-transparent hover:border-saona-blue/20">
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-saona-blue/10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <Icon className="w-6 h-6 text-gray-500 group-hover:text-saona-blue transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 group-hover:text-saona-blue transition-colors">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-saona-blue group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
