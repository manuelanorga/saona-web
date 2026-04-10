'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Category, Product } from '@/types';
import { FileText, MessageCircle, ShoppingCart, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  categories: Category[];
  initialCat?: string;
}

export default function ProductsGrid({ categories, initialCat }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCat || null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('sort_order');

      if (activeCategory) {
        const cat = categories.find((c) => c.slug === activeCategory);
        if (cat) query = query.eq('category_id', cat.id);
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [activeCategory, categories]);

  const whatsapp = (product: Product) => {
    const msg = product.whatsapp_message || `Hola, me interesa el producto: ${product.name}`;
    return `https://wa.me/51981272614?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category filter carousel */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={clsx(
              'flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all',
              !activeCategory
                ? 'border-saona-blue bg-saona-blue text-white'
                : 'border-gray-200 text-gray-600 hover:border-saona-blue hover:text-saona-blue'
            )}
          >
            <span className="text-2xl">📋</span>
            <span className="text-xs font-semibold whitespace-nowrap">Todos</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
              className={clsx(
                'flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all min-w-[100px]',
                activeCategory === cat.slug
                  ? 'border-saona-blue bg-saona-blue text-white'
                  : 'border-gray-200 text-gray-600 hover:border-saona-blue hover:text-saona-blue'
              )}
            >
              <span className="text-2xl">
                {cat.slug === 'linea-industrial' ? '🏭' :
                 cat.slug === 'pinturas-construccion' ? '🏗️' :
                 cat.slug === 'linea-decorativa' ? '🎨' :
                 cat.slug === 'linea-madera' ? '🌳' :
                 cat.slug === 'linea-trafico' ? '🚦' :
                 cat.slug === 'linea-limpieza' ? '✨' : '🧪'}
              </span>
              <span className="text-xs font-semibold text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            Mostrando <span className="font-semibold text-gray-800">{products.length}</span> resultado{products.length !== 1 ? 's' : ''}
          </p>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm text-saona-blue hover:underline"
            >
              Limpiar filtro
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-lg font-semibold">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} whatsappUrl={whatsapp(product)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, whatsappUrl }: { product: Product; whatsappUrl: string }) {
  return (
    <div className="product-card bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Image */}
      <Link href={`/productos/${product.slug}`}>
        <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-5xl opacity-30">🪣</div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <span className="text-xs text-saona-blue font-semibold uppercase tracking-wide">
            {product.category.name}
          </span>
        )}
        <Link href={`/productos/${product.slug}`}>
          <h3 className="font-bold text-gray-900 mt-1 text-sm leading-tight hover:text-saona-blue transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.content_type && (
          <p className="text-xs text-gray-400 mt-1">{product.content_type}</p>
        )}

        {/* CTA Buttons */}
        <div className="mt-3 flex flex-col gap-2">
          {product.cta_type === 'compra' ? (
            <a
              href={whatsappUrl}
              target="_blank"
              className="flex items-center justify-center gap-1 bg-saona-green text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-saona-green-dark transition-colors"
            >
              <ShoppingCart className="w-3 h-3" />
              Compra aquí
            </a>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              className="flex items-center justify-center gap-1 bg-saona-blue text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-saona-blue-dark transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              Cotízalo aquí
            </a>
          )}
          {product.pdf_url && (
            <a
              href={product.pdf_url}
              target="_blank"
              className="flex items-center justify-center gap-1 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg hover:border-saona-blue hover:text-saona-blue transition-colors"
            >
              <FileText className="w-3 h-3" />
              Manual técnico
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
