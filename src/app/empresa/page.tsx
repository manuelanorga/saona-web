import { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import { Shield, Zap, Award, Users, Target, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Empresa | SAONA',
  description: 'Conoce más sobre SAONA, empresa peruana de pinturas y recubrimientos desde 2002.',
};

const values = [
  { icon: Shield, title: 'Honestidad', desc: 'Actuamos con transparencia y ética en cada decisión.' },
  { icon: Zap, title: 'Innovación', desc: 'Buscamos siempre los mejores productos y soluciones.' },
  { icon: Award, title: 'Calidad', desc: 'No negociamos con los estándares de excelencia.' },
  { icon: Users, title: 'Compromiso', desc: 'Con nuestros clientes, colaboradores y el país.' },
];

const timeline = [
  { year: '2002', title: 'Fundación', desc: 'SAONA nace en Lima con la visión de llevar productos de calidad a cada proyecto de construcción y decoración.' },
  { year: '2008', title: 'Expansión', desc: 'Ampliamos nuestra línea de productos incorporando solventes industriales y líneas especializadas.' },
  { year: '2015', title: 'Certificaciones', desc: 'Obtenemos certificaciones de calidad y expandimos nuestra presencia a nivel nacional.' },
  { year: '2020', title: 'Digitalización', desc: 'Lanzamos nuevos canales digitales para acercarnos más a nuestros clientes.' },
  { year: '2025', title: 'Hoy', desc: 'Más de 20 años siendo el aliado de confianza en pinturas, solventes y construcción en el Perú.' },
];

export default function EmpresaPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-saona-navy to-saona-blue-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-400 rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-saona-green text-xs font-bold uppercase tracking-widest">
            ¿Quiénes somos?
          </span>
          <h1 className="text-white font-black text-4xl lg:text-5xl mt-3 mb-4">
            Empresa de pinturas con propósito
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Somos un equipo apasionado que actuamos con honestidad y transparencia en todo lo que hacemos, desde 2002.
          </p>
        </div>
      </div>

      {/* Who we are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center">
              <div className="text-center text-gray-300">
                <Users className="w-20 h-20 mx-auto mb-3" />
                <p className="text-sm">Equipo SAONA</p>
              </div>
            </div>
            <div>
              <span className="text-saona-blue font-bold text-xs uppercase tracking-widest">
                Nosotros
              </span>
              <h2 className="text-3xl font-black text-saona-navy mt-2 mb-4">
                Más de 20 años construyendo confianza
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nuestro equipo está formado por profesionales altamente capacitados y dedicados, que trabajan con entusiasmo para brindarte productos y servicios que superen tus expectativas.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Creemos en la importancia de escuchar a nuestros clientes, entender sus necesidades y ofrecer soluciones a medida que agreguen valor a sus proyectos. Cada producto que ofrecemos ha sido seleccionado y probado para garantizar resultados excepcionales.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="font-black text-4xl text-saona-blue">2002</p>
                  <p className="text-sm text-gray-500">Año de fundación</p>
                </div>
                <div>
                  <p className="font-black text-4xl text-saona-blue">+13</p>
                  <p className="text-sm text-gray-500">Líneas de producto</p>
                </div>
                <div>
                  <p className="font-black text-4xl text-saona-blue">Lima</p>
                  <p className="text-sm text-gray-500">Sede principal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mision" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-saona-navy text-white rounded-3xl p-10">
              <div className="w-12 h-12 bg-saona-blue rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-black text-2xl mb-4">Misión</h3>
              <p className="text-white/70 leading-relaxed">
                Proveer productos de pintura, solventes y construcción de alta calidad, accesibles y confiables, que contribuyan al desarrollo de los proyectos de nuestros clientes, aportando valor a través de la innovación y el servicio personalizado.
              </p>
            </div>
            <div className="bg-saona-blue text-white rounded-3xl p-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-black text-2xl mb-4">Visión</h3>
              <p className="text-white/80 leading-relaxed">
                Ser la empresa líder en el mercado peruano de pinturas y recubrimientos, reconocida por la excelencia de nuestros productos, la calidad de nuestro servicio y el compromiso con la satisfacción total de nuestros clientes y el bienestar de nuestra comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-saona-blue font-bold text-xs uppercase tracking-widest">
              Lo que nos define
            </span>
            <h2 className="text-3xl font-black text-saona-navy mt-2">Nuestros valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-saona-blue hover:bg-blue-50 transition-all group">
                <div className="w-14 h-14 bg-saona-blue/10 group-hover:bg-saona-blue rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon className="w-7 h-7 text-saona-blue group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-black text-lg text-saona-navy mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-saona-blue font-bold text-xs uppercase tracking-widest">
              Nuestra historia
            </span>
            <h2 className="text-3xl font-black text-saona-navy mt-2">El camino recorrido</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-saona-blue to-saona-green" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative flex gap-8 pl-16">
                  <div className="absolute left-0 w-12 h-12 bg-saona-blue text-white rounded-full flex items-center justify-center font-black text-xs border-4 border-white shadow">
                    {item.year.slice(-2)}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-saona-blue font-black">{item.year}</span>
                      <span className="font-bold text-gray-900">{item.title}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
