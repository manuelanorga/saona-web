import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Youtube, Instagram } from 'lucide-react';

const productLinks = [
  { href: '/productos?cat=linea-decorativa', label: 'Línea Decorativa' },
  { href: '/productos?cat=linea-industrial', label: 'Línea Industrial' },
  { href: '/productos?cat=linea-limpieza', label: 'Línea Limpieza' },
  { href: '/productos?cat=linea-madera', label: 'Línea Madera' },
  { href: '/productos?cat=linea-trafico', label: 'Línea Tráfico' },
  { href: '/productos?cat=pinturas-construccion', label: 'Pinturas Construcción' },
  { href: '/productos', label: 'Todos los productos' },
];

const companyLinks = [
  { href: '/empresa', label: 'Nosotros' },
  { href: '/productos', label: 'Productos' },
  { href: '/pintame', label: 'Simulador de Pintado' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Footer() {
  const whatsappNum = '51981272614';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=Hola, me gustaría cotizar algunos productos SAONA.`;

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Wave top */}
      <div className="bg-white overflow-hidden h-8">
        <svg viewBox="0 0 1440 32" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-saona-blue rounded-full flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="font-black text-xl tracking-wide text-saona-navy uppercase">
                SAONA
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Pinturas, solventes y productos de construcción de alta calidad. Desde 2002 siendo tu aliado en cada proyecto.
            </p>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-saona-blue flex-shrink-0" />
                <a href="tel:+51981272614" className="hover:text-saona-blue">
                  +51 981 272 614
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-saona-blue flex-shrink-0" />
                <span>Lunes a Viernes: 9 am – 6 pm</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-saona-blue flex-shrink-0 mt-0.5" />
                <span>Av. Trapiche 2240, Puente Piedra, Lima</span>
              </div>
            </div>

            <Link
              href={whatsappUrl}
              target="_blank"
              className="inline-flex items-center gap-2 mt-4 bg-saona-blue text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-saona-blue-dark transition-colors"
            >
              Cotiza aquí
            </Link>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-saona-blue uppercase text-xs tracking-wider mb-4">
              Productos
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-saona-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-saona-blue uppercase text-xs tracking-wider mb-4">
              Nosotros
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-saona-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-saona-blue uppercase text-xs tracking-wider mt-6 mb-4">
              Correo
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <a
                href="mailto:gerencia@saona.com.pe"
                className="flex items-center gap-1 hover:text-saona-blue transition-colors"
              >
                <Mail className="w-3 h-3" />
                gerencia@saona.com.pe
              </a>
              <a
                href="mailto:ventas@saona.com.pe"
                className="flex items-center gap-1 hover:text-saona-blue transition-colors"
              >
                <Mail className="w-3 h-3" />
                ventas@saona.com.pe
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-saona-blue uppercase text-xs tracking-wider mb-4">
              Redes Sociales
            </h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/saona"
                target="_blank"
                className="w-9 h-9 bg-saona-blue/10 hover:bg-saona-blue text-saona-blue hover:text-white rounded-full flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/saona"
                target="_blank"
                className="w-9 h-9 bg-saona-blue/10 hover:bg-saona-blue text-saona-blue hover:text-white rounded-full flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@saona"
                target="_blank"
                className="w-9 h-9 bg-saona-blue/10 hover:bg-saona-blue text-saona-blue hover:text-white rounded-full flex items-center justify-center transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} saona.com.pe | Todos los derechos reservados
          </p>
          <p className="text-xs text-gray-400">
            Desarrollado con ❤️ en Lima, Perú
          </p>
        </div>
      </div>
    </footer>
  );
}
