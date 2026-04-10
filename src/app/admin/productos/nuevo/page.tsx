import { createAdminClient } from '@/lib/supabase';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NuevoProductoPage() {
  const admin = createAdminClient();
  const { data: categories } = await admin
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/productos" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Nuevo producto</h1>
          <p className="text-gray-500 text-sm">Agrega un producto al catálogo</p>
        </div>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  );
}
