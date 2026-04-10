'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { supabase, uploadFile } from '@/lib/supabase';
import { Environment } from '@/types';
import { Plus, Trash2, Upload, Save, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAmbientesPage() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newEnv, setNewEnv] = useState({ name: '', image_url: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    const { data } = await supabase.from('environments').select('*').order('sort_order');
    setEnvironments(data || []);
    setLoading(false);
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

  const addEnvironment = async () => {
    if (!newEnv.name) return toast.error('El nombre es requerido');
    if (!imageFile && !newEnv.image_url) return toast.error('La imagen es requerida');

    setUploading(true);
    try {
      let imageUrl = newEnv.image_url;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        imageUrl = await uploadFile('environments', `${Date.now()}-${newEnv.name}.${ext}`, imageFile);
      }

      const { data, error } = await supabase
        .from('environments')
        .insert({
          name: newEnv.name,
          image_url: imageUrl,
          sort_order: environments.length,
        })
        .select()
        .single();

      if (error) throw error;
      setEnvironments([...environments, data]);
      setNewEnv({ name: '', image_url: '' });
      setImageFile(null);
      setImagePreview('');
      toast.success('Ambiente agregado');
    } catch (err: any) {
      toast.error(err.message || 'Error al agregar');
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (env: Environment) => {
    const { error } = await supabase
      .from('environments')
      .update({ is_active: !env.is_active })
      .eq('id', env.id);
    if (error) return toast.error('Error al actualizar');
    setEnvironments(environments.map((e) => e.id === env.id ? { ...e, is_active: !e.is_active } : e));
  };

  const deleteEnv = async (id: string) => {
    if (!confirm('¿Eliminar este ambiente?')) return;
    const { error } = await supabase.from('environments').delete().eq('id', id);
    if (error) return toast.error('Error al eliminar');
    setEnvironments(environments.filter((e) => e.id !== id));
    toast.success('Ambiente eliminado');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Ambientes del Simulador</h1>
        <p className="text-gray-500 text-sm">Gestiona las fotos de ambientes del simulador de pintado</p>
      </div>

      {/* Add new environment */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-4">Agregar ambiente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del ambiente *</label>
              <input
                type="text"
                value={newEnv.name}
                onChange={(e) => setNewEnv({ ...newEnv, name: e.target.value })}
                placeholder="Ej: Sala, Dormitorio, Baño..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">O usa URL de imagen</label>
              <input
                type="url"
                value={newEnv.image_url}
                onChange={(e) => setNewEnv({ ...newEnv, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
              />
            </div>
            <button
              onClick={addEnvironment}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-saona-blue text-white font-semibold py-2.5 rounded-xl hover:bg-saona-blue-dark transition-colors disabled:opacity-60"
            >
              {uploading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {uploading ? 'Subiendo...' : 'Agregar ambiente'}
            </button>
          </div>

          <div>
            {imagePreview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image src={imagePreview} alt="preview" fill className="object-cover" />
                <button
                  onClick={() => { setImagePreview(''); setImageFile(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >✕</button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-200 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-saona-blue hover:bg-blue-50 transition-colors"
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">{isDragActive ? 'Suelta aquí' : 'Sube una foto del ambiente'}</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (4:3 o 16:9 recomendado)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Environments grid */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-4">Ambientes actuales ({environments.length})</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : environments.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No hay ambientes. Agrega el primero.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {environments.map((env) => (
              <div key={env.id} className={`relative rounded-xl overflow-hidden group border-2 ${env.is_active ? 'border-saona-blue' : 'border-gray-200 opacity-60'}`}>
                <div className="aspect-video relative">
                  <Image src={env.image_url} alt={env.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-white font-bold text-sm">{env.name}</span>
                  </div>
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => toggleActive(env)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${env.is_active ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
                    >
                      {env.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => deleteEnv(env.id)}
                      className="p-1.5 bg-red-500 text-white rounded-full"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
