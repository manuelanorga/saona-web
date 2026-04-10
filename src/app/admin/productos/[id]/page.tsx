import { createAdminClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Props { params: { id: string } }

export default async function EditarProductoPage({ params }: Props) {
  const admin = createAdminClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    admin.from('products').select('*').eq('id', params.id).single(),
    admin.from('categories').select('*').eq('is_active', true).order('sort_order'),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/productos" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Editar producto</h1>
          <p className="text-gray-500 text-sm">{product.name}</p>
        </div>
      </div>
      <ProductForm categories={categories || []} product={product} isEdit />
    </div>
  );
}
