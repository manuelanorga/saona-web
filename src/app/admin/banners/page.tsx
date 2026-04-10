'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { supabase, uploadFile } from '@/lib/supabase';
import { HeroSlide } from '@/types';
import { Plus, Trash2, Upload, Save, Eye, EyeOff, GripVertical, X, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_SLIDE: Partial<HeroSlide> = {
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  color_start: '#050E1F',
  color_end: '#0D47A1',
  cta_primary_text: 'Ver productos',
  cta_primary_link: '/productos',
  cta_secondary_text: 'Compra por WhatsApp',
  cta_secondary_link: 'https://wa.me/51981272614',
  is_active: true,
};

export default function AdminBannersPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editing, setEditing] = useState<Partial<HeroSlide> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [useImage, setUseImage] = useState(false);

  useEffect(() => { fetchSlides(); }, []);

  const fetchSlides = async () => {
    try {
      const { data } = await supabase.from('hero_slides').select('*').order('sort_order');
      setSlides(data || []);
    } catch (e) {}
    setLoading(false);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditing({ ...slide });
    setIsNew(false);
    setImagePreview(slide.image_url || '');
    setUseImage(!!slide.image_url);
    setImageFile(null);
  };

  const openNew = () => {
    setEditing({ ...EMPTY_SLIDE, sort_order: slides.length + 1 });
    setIsNew(true);
    setImagePreview('');
    setUseImage(false);
    setImageFile(null);
  };

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const save = async () => {
    if (!editing?.title) return toast.error('El título es requerido');
    setSaving(true);
    try {
      let imageUrl = useImage ? (editing.image_url || '') : '';
      if (useImage && imageFile) {
        const ext = imageFile.name.split('.').pop();
        imageUrl = await uploadFile('general', `hero-${Date.now()}.${ext}`, imageFile);
      }

      const data = {
        title: editing.title,
        subtitle: editing.subtitle || '',
        description: editing.description || '',
        image_url: imageUrl || null,
        color_start: editing.color_start || '#050E1F',
        color_end: editing.color_end || '#0D47A1',
        cta_primary_text: editing.cta_primary_text || '',
        cta_primary_link: editing.cta_primary_link || '/productos',
        cta_secondary_text: editing.cta_secondary_text || '',
        cta_secondary_link: editing.cta_secondary_link || '',
        is_active: editing.is_active ?? true,
        sort_order: editing.sort_order || slides.length + 1,
      };

      if (isNew) {
        const { error } = await supabase.from('hero_slides').insert(data);
        if (error) throw error;
        toast.success('Banner creado');
      } else {
        const { error } = await supabase.from('hero_slides').update(data).eq('id', editing.id!);
        if (error) throw error;
        toast.success('Banner actualizado');
      }
      setEditing(null);
      fetchSlides();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    await supabase.from('hero_slides').update({ is_active: !slide.is_active }).eq('id', slide.id);
    setSlides(slides.map(s => s.id === slide.id ? { ...s, is_active: !s.is_active } : s));
  };

  const deleteSlide = async (id: string) => {
    if (!confirm('¿Eliminar este banner?')) return;
    await supabase.from('hero_slides').delete().eq('id', id);
    setSlides(slides.filter(s => s.id !== id));
    toast.success('Banner eliminado');
  };

  const previewBg = editing
    ? editing.image_url && useImage
      ? `url(${imagePreview || editing.image_url})`
      : `linear-gradient(135deg, ${editing.color_start || '#050E1F'} 0%, ${editing.color_end || '#0D47A1'} 100%)`
    : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Banners del Hero</h1>
          <p className="text-gray-500 text-sm">{slides.length} banners configurados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-saona-blue text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-saona-blue-dark transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Nuevo banner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slides list */}
        <div className="space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />)
          ) : slides.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-dashed border-gray-200">
              <p className="text-3xl mb-2">🖼</p>
              <p>No hay banners. Crea el primero.</p>
            </div>
          ) : (
            slides.map((slide) => (
              <div
                key={slide.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${editing?.id === slide.id ? 'border-saona-blue' : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => openEdit(slide)}
              >
                {/* Mini preview */}
                <div
                  className="h-20 relative flex items-center px-5"
                  style={{
                    background: slide.image_url
                      ? `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${slide.image_url}) center/cover`
                      : `linear-gradient(135deg, ${slide.color_start || '#050E1F'}, ${slide.color_end || '#0D47A1'})`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    {slide.subtitle && (
                      <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-0.5">{slide.subtitle}</p>
                    )}
                    <p className="text-white font-bold text-sm truncate">{slide.title}</p>
                    <p className="text-white/60 text-xs truncate">{slide.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleActive(slide); }}
                      className={`p-1.5 rounded-full ${slide.is_active ? 'bg-green-500' : 'bg-gray-500'}`}
                    >
                      {slide.is_active ? <Eye className="w-3 h-3 text-white" /> : <EyeOff className="w-3 h-3 text-white" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }}
                      className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-500"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Editor panel */}
        {editing ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Preview */}
            <div
              className="h-36 relative flex items-end p-4 transition-all duration-500"
              style={{
                background: useImage && (imagePreview || editing.image_url)
                  ? `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url(${imagePreview || editing.image_url}) center/cover`
                  : `linear-gradient(135deg, ${editing.color_start || '#050E1F'} 0%, ${editing.color_end || '#0D47A1'} 100%)`,
              }}
            >
              {editing.subtitle && (
                <div className="absolute top-3 left-4">
                  <span className="text-green-400 text-xs font-bold uppercase tracking-widest border border-green-400/40 rounded-full px-2 py-0.5">
                    {editing.subtitle}
                  </span>
                </div>
              )}
              <div>
                <p className="text-white font-black text-base leading-tight">{editing.title || 'Título del banner'}</p>
                <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{editing.description}</p>
                <div className="flex gap-2 mt-2">
                  {editing.cta_primary_text && (
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">{editing.cta_primary_text}</span>
                  )}
                  {editing.cta_secondary_text && (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">{editing.cta_secondary_text}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4 max-h-[520px] overflow-y-auto">
              {/* Texts */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Textos</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editing.subtitle || ''}
                    onChange={e => setEditing({ ...editing, subtitle: e.target.value })}
                    placeholder="Etiqueta (ej: SOLVENTES)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
                  />
                  <textarea
                    value={editing.title}
                    onChange={e => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Título principal *"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue resize-none"
                  />
                  <textarea
                    value={editing.description || ''}
                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Descripción"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue resize-none"
                  />
                </div>
              </div>

              {/* Background */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Fondo</label>
                  <div className="flex gap-2">
                    <button onClick={() => setUseImage(false)} className={`text-xs px-2 py-1 rounded-lg font-semibold ${!useImage ? 'bg-saona-blue text-white' : 'bg-gray-100 text-gray-600'}`}>
                      Degradado
                    </button>
                    <button onClick={() => setUseImage(true)} className={`text-xs px-2 py-1 rounded-lg font-semibold ${useImage ? 'bg-saona-blue text-white' : 'bg-gray-100 text-gray-600'}`}>
                      Imagen
                    </button>
                  </div>
                </div>

                {!useImage ? (
                  <div className="flex gap-3 items-center">
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">Color inicio</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={editing.color_start || '#050E1F'} onChange={e => setEditing({ ...editing, color_start: e.target.value })} className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0.5" />
                        <input type="text" value={editing.color_start || '#050E1F'} onChange={e => setEditing({ ...editing, color_start: e.target.value })} className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-saona-blue" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">Color fin</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={editing.color_end || '#0D47A1'} onChange={e => setEditing({ ...editing, color_end: e.target.value })} className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0.5" />
                        <input type="text" value={editing.color_end || '#0D47A1'} onChange={e => setEditing({ ...editing, color_end: e.target.value })} className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-saona-blue" />
                      </div>
                    </div>
                  </div>
                ) : (
                  imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden h-24">
                      <Image src={imagePreview} alt="preview" fill className="object-cover" />
                      <button onClick={() => { setImagePreview(''); setImageFile(null); setEditing({ ...editing, image_url: '' }); }} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div {...getRootProps()} className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-saona-blue hover:bg-blue-50 transition-colors">
                      <input {...getInputProps()} />
                      <Upload className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">{isDragActive ? 'Suelta aquí' : 'Arrastra o haz clic para subir imagen'}</p>
                    </div>
                  )
                )}
              </div>

              {/* CTAs */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Botones</label>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={editing.cta_primary_text} onChange={e => setEditing({ ...editing, cta_primary_text: e.target.value })} placeholder="Texto botón 1" className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue" />
                    <input type="text" value={editing.cta_primary_link} onChange={e => setEditing({ ...editing, cta_primary_link: e.target.value })} placeholder="Link botón 1" className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={editing.cta_secondary_text} onChange={e => setEditing({ ...editing, cta_secondary_text: e.target.value })} placeholder="Texto botón 2" className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue" />
                    <input type="text" value={editing.cta_secondary_link || ''} onChange={e => setEditing({ ...editing, cta_secondary_link: e.target.value })} placeholder="Link botón 2" className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue" />
                  </div>
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={editing.is_active ?? true} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 peer-checked:bg-saona-blue rounded-full transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow" />
                </div>
                <span className="text-sm font-medium text-gray-700">Banner activo</span>
              </label>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditing(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-saona-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-saona-blue-dark disabled:opacity-60">
                  {saving ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {isNew ? 'Crear banner' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center h-64">
            <div className="text-center text-gray-400">
              <p className="text-3xl mb-2">👈</p>
              <p className="text-sm">Selecciona un banner para editar</p>
              <p className="text-xs mt-1">o crea uno nuevo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
