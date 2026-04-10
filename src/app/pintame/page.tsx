import { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import PaintSimulator from '@/components/pintame/PaintSimulator';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Simulador de Pintado | SAONA',
  description: 'Visualiza cómo quedarán los colores SAONA en tu espacio antes de pintar.',
};

export default async function PintamePage() {
  let paintLines = null;
  let environments = null;
  try {
    const { data: pl } = await supabase
      .from('paint_lines')
      .select('*, colors(*)')
      .eq('is_active', true)
      .order('sort_order');
    paintLines = pl;
    const { data: env } = await supabase
      .from('environments')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    environments = env;
  } catch (e) {}

  return (
    <PublicLayout>
      <div className="bg-saona-navy py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-saona-green text-xs font-bold uppercase tracking-widest">
            Simulador de Pintado
          </span>
          <h1 className="text-white font-black text-3xl lg:text-4xl mt-2">
            🎨 Píntame
          </h1>
          <p className="text-white/60 mt-2 max-w-xl mx-auto">
            Elige el ambiente, selecciona una línea de pintura y elige tu color favorito para visualizarlo en tiempo real.
          </p>
        </div>
      </div>
      <PaintSimulator
        paintLines={paintLines || []}
        environments={environments || []}
      />
    </PublicLayout>
  );
}
