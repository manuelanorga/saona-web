'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PaintLine, Color } from '@/types';
import { Plus, Trash2, Save, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminColoresPage() {
  const [paintLines, setPaintLines] = useState<PaintLine[]>([]);
  const [activeLine, setActiveLine] = useState<string | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLineName, setNewLineName] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex_code: '#1565C0', color_code: '' });

  useEffect(() => {
    fetchLines();
  }, []);

  useEffect(() => {
    if (activeLine) fetchColors(activeLine);
  }, [activeLine]);

  const fetchLines = async () => {
    const { data } = await supabase.from('paint_lines').select('*').order('sort_order');
    setPaintLines(data || []);
    if (data && data.length > 0 && !activeLine) setActiveLine(data[0].id);
    setLoading(false);
  };

  const fetchColors = async (lineId: string) => {
    const { data } = await supabase
      .from('colors')
      .select('*')
      .eq('paint_line_id', lineId)
      .order('sort_order');
    setColors(data || []);
  };

  const addLine = async () => {
    if (!newLineName.trim()) return;
    const { data, error } = await supabase
      .from('paint_lines')
      .insert({ name: newLineName, sort_order: paintLines.length })
      .select()
      .single();
    if (error) return toast.error('Error al crear línea');
    setPaintLines([...paintLines, data]);
    setActiveLine(data.id);
    setNewLineName('');
    toast.success('Línea creada');
  };

  const deleteLine = async (id: string) => {
    if (!confirm('¿Eliminar esta línea y todos sus colores?')) return;
    const { error } = await supabase.from('paint_lines').delete().eq('id', id);
    if (error) return toast.error('Error al eliminar');
    setPaintLines(paintLines.filter((l) => l.id !== id));
    if (activeLine === id) setActiveLine(paintLines[0]?.id || null);
    toast.success('Línea eliminada');
  };

  const addColor = async () => {
    if (!activeLine || !newColor.hex_code) return;
    const { data, error } = await supabase
      .from('colors')
      .insert({
        paint_line_id: activeLine,
        name: newColor.name,
        hex_code: newColor.hex_code,
        color_code: newColor.color_code,
        sort_order: colors.length,
      })
      .select()
      .single();
    if (error) return toast.error('Error al agregar color');
    setColors([...colors, data]);
    setNewColor({ name: '', hex_code: '#1565C0', color_code: '' });
    toast.success('Color agregado');
  };

  const deleteColor = async (id: string) => {
    const { error } = await supabase.from('colors').delete().eq('id', id);
    if (error) return toast.error('Error al eliminar');
    setColors(colors.filter((c) => c.id !== id));
    toast.success('Color eliminado');
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Paleta de Colores</h1>
        <p className="text-gray-500 text-sm">Gestiona las líneas y colores del simulador de pintado</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Paint lines sidebar */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">Líneas de pintura</h2>
          <div className="space-y-1 mb-4">
            {paintLines.map((line) => (
              <div
                key={line.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${activeLine === line.id ? 'bg-saona-blue text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveLine(line.id)}
              >
                <Palette className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium flex-1 truncate">{line.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteLine(line.id); }}
                  className={`p-0.5 rounded hover:bg-red-100 hover:text-red-500 transition-colors ${activeLine === line.id ? 'text-white/70' : 'text-gray-400'}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          {/* Add new line */}
          <div className="space-y-2">
            <input
              type="text"
              value={newLineName}
              onChange={(e) => setNewLineName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLine()}
              placeholder="Nueva línea..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
            />
            <button
              onClick={addLine}
              className="w-full flex items-center justify-center gap-1 bg-saona-blue/10 text-saona-blue text-sm font-semibold py-2 rounded-xl hover:bg-saona-blue hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar línea
            </button>
          </div>
        </div>

        {/* Colors panel */}
        <div className="lg:col-span-3 space-y-4">
          {activeLine && (
            <>
              {/* Add color form */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="font-bold text-gray-800 mb-4">Agregar color</h2>
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor.hex_code}
                      onChange={(e) => setNewColor({ ...newColor, hex_code: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={newColor.hex_code}
                      onChange={(e) => setNewColor({ ...newColor, hex_code: e.target.value })}
                      placeholder="#1565C0"
                      className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-saona-blue"
                    />
                  </div>
                  <input
                    type="text"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    placeholder="Nombre del color"
                    className="flex-1 min-w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue"
                  />
                  <input
                    type="text"
                    value={newColor.color_code}
                    onChange={(e) => setNewColor({ ...newColor, color_code: e.target.value })}
                    placeholder="Código (DM-001)"
                    className="w-36 px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-saona-blue"
                  />
                  <button
                    onClick={addColor}
                    className="flex items-center gap-1 bg-saona-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-saona-blue-dark transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              </div>

              {/* Color swatches grid */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="font-bold text-gray-800 mb-4">
                  Colores ({colors.length})
                </h2>
                {colors.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No hay colores en esta línea. Agrega el primero.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {colors.map((color) => (
                      <div key={color.id} className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-gray-200 group">
                        <div
                          className="w-10 h-10 rounded-lg border border-gray-100 flex-shrink-0"
                          style={{ backgroundColor: color.hex_code }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{color.name || 'Sin nombre'}</p>
                          <p className="text-xs text-gray-400 font-mono">{color.color_code}</p>
                          <p className="text-xs text-gray-300 font-mono">{color.hex_code}</p>
                        </div>
                        <button
                          onClick={() => deleteColor(color.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
