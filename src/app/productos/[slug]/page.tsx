import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PublicLayout from '@/components/layout/PublicLayout';
import { CheckCircle2, FileText, MessageCircle, ChevronRight, Package } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', params.slug)
    .single();

  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: `${product.name} | SAONA`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!product) notFound();

  const whatsappMsg = product.whatsapp_message || `Hola, me interesa cotizar el producto: ${product.name}`;
  const whatsappUrl = `https://wa.me/51981272614?text=${encodeURIComponent(whatsappMsg)}`;

  // Related products
  const { data: related } = await supabase
    .from('products')
    .select('id, name, slug, image_url, content_type')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-saona-blue">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/productos" className="hover:text-saona-blue">Productos</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/productos?cat=${product.category.slug}`} className="hover:text-saona-blue">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="bg-gray-50 rounded-3xl aspect-square flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-3/4 h-3/4 object-contain"
                />
              ) : (
                <div className="text-8xl opacity-20">🪣</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            {product.sku && (
              <p className="text-gray-400 text-sm mb-1">SKU: {product.sku}</p>
            )}
            <h1 className="font-black text-3xl text-saona-navy mb-4">{product.name}</h1>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={whatsappUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 bg-saona-blue text-white font-semibold px-6 py-3 rounded-full hover:bg-saona-blue-dark transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {product.cta_type === 'compra' ? 'Compra aquí' : 'Cotiza aquí'}
              </a>
              {product.pdf_url && (
                <a
                  href={product.pdf_url}
                  target="_blank"
                  className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full hover:border-saona-blue hover:text-saona-blue transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Ficha Técnica PDF
                </a>
              )}
            </div>

            {/* Specs */}
            <div className="space-y-3 mb-6">
              {product.content_type && (
                <div className="flex gap-3">
                  <Package className="w-4 h-4 text-saona-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-sm text-gray-700">Contenido: </span>
                    <span className="text-sm text-gray-600">{product.content_type}</span>
                  </div>
                </div>
              )}
              {product.product_type && (
                <div className="flex gap-3">
                  <Package className="w-4 h-4 text-saona-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-sm text-gray-700">Tipo: </span>
                    <span className="text-sm text-gray-600">{product.product_type}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Characteristics */}
            {product.characteristics && product.characteristics.length > 0 && (
              <div className="bg-blue-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Características principales:</h3>
                <ul className="space-y-2">
                  {product.characteristics.map((char: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-saona-blue flex-shrink-0 mt-0.5" />
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-black text-2xl text-saona-navy mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/productos/${p.slug}`}
                  className="group bg-gray-50 rounded-2xl p-4 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="aspect-square flex items-center justify-center mb-3">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} width={120} height={120} className="object-contain" />
                    ) : (
                      <span className="text-4xl opacity-20">🪣</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-saona-blue transition-colors">
                    {p.name}
                  </p>
                  {p.content_type && (
                    <p className="text-xs text-gray-400 mt-1">{p.content_type}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
