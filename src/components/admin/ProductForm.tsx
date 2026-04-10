'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { supabase, uploadFile } from '@/lib/supabase';
import { Category, Product } from '@/types';
import { Upload, X, Plus, Trash2, FileText, Save } from 'lucide-react';
import slugify from 'slugify';

interface Props {
  categories: Category[];
  product?: Partial<Product>;
  isEdit?: boolean;
}

export default function ProductForm({ categories, product, isEdit }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    content_type: product?.content_type || '',
    product_type: product?.product_type || '',
    sku: product?.sku || '',
    cta_type: product?.cta_type || 'cotiza',
    whatsapp_message: product?.whatsapp_message || '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    sort_order: product?.sort_order ?? 0,
  });

  const [characteristics, setCharacteristics] = useState<string[]>(
    product?.characteristics || ['']
  );
  const [imagePreview, setImagePreview] = useState(product?.image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState(product?.pdf_url || '');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: isEdit ? f.slug : slugify(name, { lower: true, strict: true }),
    }));
  };

  // Image dropzone
  const onImageDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps: getImgProps, getInputProps: getImgInputProps, isDragActive: isImgDrag } = useDropzone({
    onDrop: onImageDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  });

  // PDF dropzone
  const onPdfDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPdfFile(file);
    setPdfPreview(file.name);
  }, []);

  const { getRootProps: getPdfProps, getInputProps: getPdfInputProps } = useDropzone({
    onDrop: onPdfDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  // Characteristics handlers
  const addCharacteristic = () => setCharacteristics((c) => [...c, '']);
  const removeCharacteristic = (i: number) =>
    setCharacteristics((c) => c.filter((_, idx) => idx !== i));
  const updateCharacteristic = (i: number, val: string) =>
    setCharacteristics((c) => c.map((item, idx) => (idx === i ? val : item)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return toast.error('Nombre y slug son requeridos');
    setLoading(true);

    try {
      let imageUrl = product?.image_url || '';
      let pdfUrl = product?.pdf_url || '';

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        imageUrl = await uploadFile('products', `${form.slug}-${Date.now()}.${ext}`, imageFile);
      }
      if (pdfFile) {
        pdfUrl = await uploadFile('manuals', `${form.slug}-manual.pdf`, pdfFile);
      }

      const data = {
        ...form,
        characteristics: characteristics.filter(Boolean),
        image_url: imageUrl || null,
        pdf_url: pdfUrl || null,
        category_id: form.category_id || null,
      };

      if (isEdit && product?.id) {
        const { error } = await supabase.from('products').update(data).eq('id', product.id);
        if (error) throw error;
        toast.success('Producto actualizado');
      } else {
        const { error } = await supabase.from('products').insert(data);
        if (error) throw error;
        toast.success('Producto creado');
      }

      router.push('/admin/productos');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800">Información básica</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Pintura Dura Matex SAONA"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="pintura-dura-matex-saona"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">URL: /productos/{form.slug}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Descripción detallada del producto..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue bg-white"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="004-2025"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contenido / Presentación</label>
                <input
                  type="text"
                  value={form.content_type}
                  onChange={(e) => setForm({ ...form, content_type: e.target.value })}
                  placeholder="1 galón (3.78 litros)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de producto</label>
                <input
                  type="text"
                  value={form.product_type}
                  onChange={(e) => setForm({ ...form, product_type: e.target.value })}
                  placeholder="Látex premium mate"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
                />
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Características</h2>
              <button
                type="button"
                onClick={addCharacteristic}
                className="flex items-center gap-1 text-saona-blue text-sm hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {characteristics.map((char, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={char}
                    onChange={(e) => updateCharacteristic(i, e.target.value)}
                    placeholder={`Característica ${i + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
                  />
                  <button
                    type="button"
                    onClick={() => removeCharacteristic(i)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800">Configuración del botón</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de CTA</label>
              <select
                value={form.cta_type}
                onChange={(e) => setForm({ ...form, cta_type: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue bg-white"
              >
                <option value="cotiza">Cotiza aquí (WhatsApp)</option>
                <option value="compra">Compra aquí (WhatsApp)</option>
                <option value="whatsapp">Mensaje personalizado WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mensaje WhatsApp personalizado
              </label>
              <input
                type="text"
                value={form.whatsapp_message}
                onChange={(e) => setForm({ ...form, whatsapp_message: e.target.value })}
                placeholder="Hola, me interesa el producto: [nombre]"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800">Estado y publicación</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 peer-checked:bg-saona-blue rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow" />
              </div>
              <span className="text-sm font-medium text-gray-700">Producto activo</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 peer-checked:bg-saona-blue rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow" />
              </div>
              <span className="text-sm font-medium text-gray-700">Destacado en inicio</span>
            </label>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Imagen del producto</h2>
            {imagePreview ? (
              <div className="relative">
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="object-contain max-h-48 w-auto"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setImagePreview(''); setImageFile(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                {...getImgProps()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-saona-blue hover:bg-blue-50 transition-colors"
              >
                <input {...getImgInputProps()} />
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {isImgDrag ? 'Suelta aquí' : 'Arrastra o haz clic'}
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
              </div>
            )}
          </div>

          {/* PDF upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Ficha técnica (PDF)</h2>
            {pdfPreview ? (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <FileText className="w-8 h-8 text-saona-blue flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{pdfPreview.split('/').pop()}</p>
                  <p className="text-xs text-gray-500">Manual técnico</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setPdfPreview(''); setPdfFile(null); }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                {...getPdfProps()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-saona-blue hover:bg-blue-50 transition-colors"
              >
                <input {...getPdfInputProps()} />
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Sube el PDF técnico</p>
                <p className="text-xs text-gray-400 mt-1">Solo archivos .PDF</p>
              </div>
            )}
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-saona-blue text-white font-bold py-3.5 rounded-xl hover:bg-saona-blue-dark transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Guardando...' : isEdit ? 'Actualizar producto' : 'Crear producto'}
          </button>
        </div>
      </div>
    </form>
  );
}
