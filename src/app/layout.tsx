import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'SAONA | Pinturas, Solventes y Construcción',
    template: '%s | SAONA',
  },
  description:
    'Imprimante, Temple, Fragua, Pinturas y Solventes Saona: alta resistencia, fácil aplicación y resultados duraderos para cada proyecto. Desde 2002.',
  keywords: ['pinturas', 'saona', 'solventes', 'imprimante', 'construcción', 'peru', 'lima'],
  openGraph: {
    title: 'SAONA | Pinturas y Recubrimientos',
    description: 'Calidad superior desde la base hasta el acabado',
    url: 'https://saona.com.pe',
    siteName: 'SAONA',
    locale: 'es_PE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
