import { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import Hero from '@/components/home/Hero';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Shield, Zap, Award, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Inicio | SAONA Pinturas y Recubrimientos',
};

const categories = [
  { name: 'Línea Industrial', slug: 'linea-industrial', emoji: '🏭', count: '7 productos' },
  { name: 'Pinturas Construcción', slug: 'pinturas-construccion', emoji: '🏗️', count: '5 productos' },
  { name: 'Línea Decorativa', slug: 'linea-decorativa', emoji: '🎨', count: '3 productos' },
  { name: 'Línea Madera', slug: 'linea-madera', emoji: '🌳', count: '2 productos' },
  { name: 'Línea Tráfico', slug: 'linea-trafico', emoji: '🚦', count: '2 productos' },
  { name: 'Línea Limpieza', slug: 'linea-limpieza', emoji: '✨', count: '3 productos' },
];

const features = [
  { icon: Shield, title: 'Alta Resistencia', desc: 'Productos formulados para máxima durabilidad en cualquier ambiente.' },
  { icon: Zap, title: 'Fácil Aplicación', desc: 'Tecnología avanzada para resultados profesionales sin complicaciones.' },
  { icon: Award, title: 'Calidad Certificada', desc: 'Más de 20 años garantizando estándares de calidad superiores.' },
  { icon: Users, title: 'Asesoría Experta', desc: 'Nuestro equipo te guía en la elección del producto ideal.' },
];

export default async function HomePage() {
  // Fetch featured products
  let featuredProducts = null;
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(4);
    featuredProducts = data;
  } catch (e) {}

  const whatsappUrl = 'https://wa.me/51981272614?text=Hola, necesito asesoría sobre productos SAONA.';

  return (
    <PublicLayout>
      {/* Hero */}
      <Hero />

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-saona-blue font-semibold text-sm uppercase tracking-widest">
              Nuestras líneas
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-saona-navy mt-2">
              Productos para cada necesidad
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/productos?cat=${cat.slug}`}
                className="group flex flex-col items-center p-5 rounded-2xl border-2 border-gray-100 hover:border-saona-blue hover:bg-blue-50 transition-all duration-300 text-center"
              >
                <span className="text-3xl mb-3">{cat.emoji}</span>
                <span className="font-bold text-sm text-gray-800 group-hover:text-saona-blue leading-tight mb-1">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400">{cat.count}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-saona-blue font-semibold hover:gap-3 transition-all"
            >
              Ver todos los productos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Solventes feature section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-saona-navy to-saona-blue h-72 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-6xl mb-2">🧪</p>
                <p className="font-bold text-xl">Solventes Premium</p>
                <p className="text-white/60 text-sm mt-1">Línea profesional</p>
              </div>
            </div>
            <div>
              <span className="inline-block bg-saona-blue text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Solventes
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-saona-navy mb-4">
                Potencia tu pintura con solventes de calidad premium.{' '}
                <span className="text-saona-green">¡Encuéntralo ahora!</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Logra acabados perfectos, secado uniforme y el máximo rendimiento en cada aplicación.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/productos?cat=solventes"
                  className="bg-saona-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-saona-blue-dark transition-colors"
                >
                  Ver Solventes
                </Link>
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  className="bg-saona-green text-white px-6 py-3 rounded-full font-semibold hover:bg-saona-green-dark transition-colors"
                >
                  Contáctanos por WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paint Simulator CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-saona-navy via-saona-blue-dark to-saona-teal rounded-3xl p-10 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
            <div className="relative">
              <p className="text-4xl mb-4">🎨</p>
              <h2 className="text-3xl lg:text-4xl font-black mb-4">
                Simula cómo quedará tu espacio
              </h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
                Usa nuestro simulador de pintado para visualizar colores en distintos ambientes antes de pintar.
              </p>
              <Link
                href="/pintame"
                className="inline-flex items-center gap-2 bg-white text-saona-blue font-bold px-8 py-4 rounded-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                🖌️ Abrir Simulador de Pintado
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-saona-blue/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-saona-blue" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden h-80 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Equipo SAONA</p>
              </div>
            </div>
            <div>
              <span className="inline-block border border-saona-blue text-saona-blue text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                ¿Quiénes somos?
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-saona-navy mb-4">
                Somos un equipo apasionado que actuamos con honestidad y transparencia en todo lo que hacemos.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nuestro equipo está formado por profesionales altamente capacitados y dedicados, que trabajan con entusiasmo para brindarte productos y servicios que superen tus expectativas.
              </p>
              <p className="text-saona-blue font-black text-2xl">
                Desde. <span className="text-4xl">2002</span>
              </p>
              <Link
                href="/empresa"
                className="inline-flex items-center gap-2 mt-6 text-saona-blue font-semibold hover:gap-3 transition-all"
              >
                Conoce más sobre nosotros <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-saona-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400 rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-400 rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/50 text-sm uppercase tracking-widest mb-2">¿Necesitas ayuda?</p>
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-6">
            Nuestros expertos te asesoran para elegir la pintura, el solvente, productos de limpieza o insumos de construcción ideales para ti.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="bg-saona-blue text-white font-semibold px-7 py-3 rounded-full hover:bg-saona-blue-dark transition-colors"
            >
              Correo
            </Link>
            <Link
              href={whatsappUrl}
              target="_blank"
              className="bg-saona-green text-white font-semibold px-7 py-3 rounded-full hover:bg-saona-green-dark transition-colors"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
