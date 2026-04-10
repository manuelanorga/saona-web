import { Metadata } from 'next';
import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import ProductsGrid from '@/components/productos/ProductsGrid';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Productos | SAONA',
  description: 'Catálogo completo de pinturas, solventes, imprimantes y más productos SAONA.',
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: { cat?: string; q?: string };
}) {
  let categories = null;
  try {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    categories = data;
  } catch (e) {}

  return (
    <PublicLayout>
      {/* Header banner */}
      <div className="bg-saona-navy py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-saona-green text-xs font-bold uppercase tracking-widest">
            Catálogo SAONA
          </span>
          <h1 className="text-white font-black text-3xl lg:text-4xl mt-2">
            Nuestros Productos
          </h1>
          <p className="text-white/60 mt-2">
            Calidad superior para cada proyecto
          </p>
        </div>
      </div>

      {/* Products grid with filters */}
      <Suspense fallback={<div className="py-20 text-center text-gray-400">Cargando productos...</div>}>
        <ProductsGrid categories={categories || []} initialCat={searchParams.cat} />
      </Suspense>
    </PublicLayout>
  );
}
