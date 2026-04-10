'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { PaintLine, Color, Environment } from '@/types';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight, Palette, Home, Copy, Check } from 'lucide-react';

// Fallback demo environments when no DB data exists
const DEMO_ENVIRONMENTS: Environment[] = [
  { id: '1', name: 'Sala', image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80', sort_order: 1, is_active: true },
  { id: '2', name: 'Dormitorio', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80', sort_order: 2, is_active: true },
  { id: '3', name: 'Comedor', image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80', sort_order: 3, is_active: true },
  { id: '4', name: 'Cocina', image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80', sort_order: 4, is_active: true },
  { id: '5', name: 'Baño', image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80', sort_order: 5, is_active: true },
  { id: '6', name: 'Exterior', image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80', sort_order: 6, is_active: true },
];

// Demo paint lines when DB is empty
const DEMO_PAINT_LINES: PaintLine[] = [
  {
    id: '1', name: 'Dura Matex', description: 'Látex premium mate', sort_order: 1, is_active: true,
    colors: [
      { id: 'c1', paint_line_id: '1', name: 'Blanco Puro', hex_code: '#FFFFFF', color_code: 'DM-001', sort_order: 1 },
      { id: 'c2', paint_line_id: '1', name: 'Marfil', hex_code: '#FFFFF0', color_code: 'DM-002', sort_order: 2 },
      { id: 'c3', paint_line_id: '1', name: 'Crema', hex_code: '#FFFDD0', color_code: 'DM-003', sort_order: 3 },
      { id: 'c4', paint_line_id: '1', name: 'Amarillo Sol', hex_code: '#FFD700', color_code: 'DM-004', sort_order: 4 },
      { id: 'c5', paint_line_id: '1', name: 'Ocre', hex_code: '#CC7722', color_code: 'DM-005', sort_order: 5 },
      { id: 'c6', paint_line_id: '1', name: 'Terracota', hex_code: '#E2725B', color_code: 'DM-006', sort_order: 6 },
      { id: 'c7', paint_line_id: '1', name: 'Rojo Colonial', hex_code: '#8B2020', color_code: 'DM-007', sort_order: 7 },
      { id: 'c8', paint_line_id: '1', name: 'Rosa Palo', hex_code: '#F4A7A0', color_code: 'DM-008', sort_order: 8 },
      { id: 'c9', paint_line_id: '1', name: 'Verde Menta', hex_code: '#9FDFB0', color_code: 'DM-009', sort_order: 9 },
      { id: 'c10', paint_line_id: '1', name: 'Verde Olivo', hex_code: '#808000', color_code: 'DM-010', sort_order: 10 },
      { id: 'c11', paint_line_id: '1', name: 'Azul Celeste', hex_code: '#87CEEB', color_code: 'DM-011', sort_order: 11 },
      { id: 'c12', paint_line_id: '1', name: 'Azul Cobalto', hex_code: '#0047AB', color_code: 'DM-012', sort_order: 12 },
      { id: 'c13', paint_line_id: '1', name: 'Azul Marino', hex_code: '#1A2456', color_code: 'DM-013', sort_order: 13 },
      { id: 'c14', paint_line_id: '1', name: 'Gris Perla', hex_code: '#E8E8E8', color_code: 'DM-014', sort_order: 14 },
      { id: 'c15', paint_line_id: '1', name: 'Gris Carbón', hex_code: '#36454F', color_code: 'DM-015', sort_order: 15 },
      { id: 'c16', paint_line_id: '1', name: 'Beige', hex_code: '#F5F0DC', color_code: 'DM-016', sort_order: 16 },
      { id: 'c17', paint_line_id: '1', name: 'Chocolate', hex_code: '#7B3F00', color_code: 'DM-017', sort_order: 17 },
      { id: 'c18', paint_line_id: '1', name: 'Lila', hex_code: '#C8A2C8', color_code: 'DM-018', sort_order: 18 },
      { id: 'c19', paint_line_id: '1', name: 'Turquesa', hex_code: '#40C0B8', color_code: 'DM-019', sort_order: 19 },
      { id: 'c20', paint_line_id: '1', name: 'Negro Grafito', hex_code: '#2C2C2C', color_code: 'DM-020', sort_order: 20 },
    ],
  },
  {
    id: '2', name: 'Látex Superior', description: 'Alta calidad', sort_order: 2, is_active: true,
    colors: [
      { id: 'l1', paint_line_id: '2', name: 'Blanco Brillante', hex_code: '#F8F8F8', color_code: 'LS-001', sort_order: 1 },
      { id: 'l2', paint_line_id: '2', name: 'Salmón', hex_code: '#FA8072', color_code: 'LS-002', sort_order: 2 },
      { id: 'l3', paint_line_id: '2', name: 'Durazno', hex_code: '#FFCBA4', color_code: 'LS-003', sort_order: 3 },
      { id: 'l4', paint_line_id: '2', name: 'Lavanda', hex_code: '#B57EDC', color_code: 'LS-004', sort_order: 4 },
      { id: 'l5', paint_line_id: '2', name: 'Celeste Suave', hex_code: '#B0D8F0', color_code: 'LS-005', sort_order: 5 },
      { id: 'l6', paint_line_id: '2', name: 'Verde Salvia', hex_code: '#8FAF8F', color_code: 'LS-006', sort_order: 6 },
      { id: 'l7', paint_line_id: '2', name: 'Mostaza', hex_code: '#E4A010', color_code: 'LS-007', sort_order: 7 },
      { id: 'l8', paint_line_id: '2', name: 'Gris Humo', hex_code: '#B0B0B0', color_code: 'LS-008', sort_order: 8 },
      { id: 'l9', paint_line_id: '2', name: 'Nude', hex_code: '#E8C9A0', color_code: 'LS-009', sort_order: 9 },
      { id: 'l10', paint_line_id: '2', name: 'Esmeralda', hex_code: '#50C878', color_code: 'LS-010', sort_order: 10 },
    ],
  },
  {
    id: '3', name: 'Super Satinado', description: 'Acabado satinado premium', sort_order: 3, is_active: true,
    colors: [
      { id: 's1', paint_line_id: '3', name: 'Blanco Satinado', hex_code: '#FAFAFA', color_code: 'SS-001', sort_order: 1 },
      { id: 's2', paint_line_id: '3', name: 'Borgoña', hex_code: '#800020', color_code: 'SS-002', sort_order: 2 },
      { id: 's3', paint_line_id: '3', name: 'Azul Pavo Real', hex_code: '#005F6B', color_code: 'SS-003', sort_order: 3 },
      { id: 's4', paint_line_id: '3', name: 'Verde Botella', hex_code: '#006400', color_code: 'SS-004', sort_order: 4 },
      { id: 's5', paint_line_id: '3', name: 'Bronce', hex_code: '#CD7F32', color_code: 'SS-005', sort_order: 5 },
      { id: 's6', paint_line_id: '3', name: 'Gris Titanio', hex_code: '#878681', color_code: 'SS-006', sort_order: 6 },
      { id: 's7', paint_line_id: '3', name: 'Cobre', hex_code: '#B87333', color_code: 'SS-007', sort_order: 7 },
      { id: 's8', paint_line_id: '3', name: 'Magenta', hex_code: '#C0006C', color_code: 'SS-008', sort_order: 8 },
    ],
  },
];

interface Props {
  paintLines: PaintLine[];
  environments: Environment[];
}

export default function PaintSimulator({ paintLines, environments }: Props) {
  const lines = paintLines.length > 0 ? paintLines : DEMO_PAINT_LINES;
  const envs = environments.length > 0 ? environments : DEMO_ENVIRONMENTS;

  const [step, setStep] = useState<'env' | 'line' | 'color'>('env');
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [selectedLine, setSelectedLine] = useState<PaintLine | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep('env');
    setSelectedEnv(null);
    setSelectedLine(null);
    setSelectedColor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4 overflow-x-auto">
            {[
              { key: 'env', label: '1. Ambiente', icon: Home },
              { key: 'line', label: '2. Línea de pintura', icon: Palette },
              { key: 'color', label: '3. Color', icon: Palette },
            ].map(({ key, label, icon: Icon }, i) => {
              const isActive = step === key;
              const isDone =
                (key === 'env' && (selectedEnv !== null || step !== 'env')) ||
                (key === 'line' && selectedLine !== null) ||
                (key === 'color' && selectedColor !== null);
              return (
                <div key={key} className="flex items-center gap-2 flex-shrink-0">
                  {i > 0 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                  <button
                    onClick={() => {
                      if (key === 'env') setStep('env');
                      if (key === 'line' && selectedEnv) setStep('line');
                      if (key === 'color' && selectedLine) setStep('color');
                    }}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                      isActive
                        ? 'bg-saona-blue text-white'
                        : isDone
                        ? 'bg-saona-blue/10 text-saona-blue hover:bg-saona-blue/20'
                        : 'text-gray-400'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                </div>
              );
            })}
            {selectedColor && (
              <button
                onClick={reset}
                className="ml-auto flex-shrink-0 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Preview Panel */}
          <div className="lg:col-span-3">
            <div className="sticky top-32">
              <div className="rounded-3xl overflow-hidden bg-gray-200 aspect-[4/3] relative shadow-2xl">
                {selectedEnv ? (
                  <>
                    <Image
                      src={selectedEnv.image_url}
                      alt={selectedEnv.name}
                      fill
                      className="object-cover"
                    />
                    {/* Color overlay simulating wall paint */}
                    {selectedColor && (
                      <div
                        className="absolute inset-0 mix-blend-multiply transition-all duration-700"
                        style={{ backgroundColor: selectedColor.hex_code, opacity: 0.35 }}
                      />
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <Home className="w-16 h-16 mb-4 opacity-30" />
                    <p className="font-semibold">Selecciona un ambiente</p>
                    <p className="text-sm">para comenzar la simulación</p>
                  </div>
                )}

                {/* Color chip overlay */}
                {selectedColor && (
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-2xl p-3 shadow-lg flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl shadow-inner border border-gray-200"
                      style={{ backgroundColor: selectedColor.hex_code }}
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{selectedColor.name}</p>
                      <p className="text-gray-500 text-xs font-mono">{selectedColor.color_code}</p>
                      <p className="text-gray-400 text-xs font-mono">{selectedColor.hex_code}</p>
                    </div>
                    <button
                      onClick={() => copyCode(selectedColor.color_code || selectedColor.hex_code)}
                      className="ml-1 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copiar código"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                )}

                {/* Environment badge */}
                {selectedEnv && (
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {selectedEnv.name}
                  </div>
                )}
              </div>

              {/* Color bar preview */}
              {selectedLine?.colors && selectedLine.colors.length > 0 && (
                <div className="mt-4 flex gap-1 rounded-xl overflow-hidden h-6">
                  {selectedLine.colors.map((c) => (
                    <div
                      key={c.id}
                      className="flex-1 cursor-pointer hover:scale-y-125 transition-transform origin-bottom"
                      style={{ backgroundColor: c.hex_code }}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 1: Choose environment */}
            <div className={clsx('bg-white rounded-2xl p-5 border-2 transition-all', step === 'env' ? 'border-saona-blue shadow-lg' : 'border-gray-100')}>
              <div className="flex items-center gap-2 mb-4">
                <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', selectedEnv ? 'bg-saona-blue text-white' : 'bg-gray-100 text-gray-500')}>
                  1
                </div>
                <h2 className="font-bold text-gray-800">Elige el ambiente</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {envs.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => {
                      setSelectedEnv(env);
                      setStep('line');
                    }}
                    className={clsx(
                      'relative rounded-xl overflow-hidden aspect-video border-2 transition-all',
                      selectedEnv?.id === env.id
                        ? 'border-saona-blue ring-2 ring-saona-blue/30'
                        : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    <Image
                      src={env.image_url}
                      alt={env.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-1 left-0 right-0 text-center text-white text-[10px] font-semibold">
                      {env.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Choose paint line */}
            {selectedEnv && (
              <div className={clsx('bg-white rounded-2xl p-5 border-2 transition-all', step === 'line' ? 'border-saona-blue shadow-lg' : 'border-gray-100')}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', selectedLine ? 'bg-saona-blue text-white' : 'bg-gray-100 text-gray-500')}>
                    2
                  </div>
                  <h2 className="font-bold text-gray-800">Elige la línea de pintura</h2>
                </div>
                <div className="space-y-2">
                  {lines.map((line) => (
                    <button
                      key={line.id}
                      onClick={() => {
                        setSelectedLine(line);
                        setSelectedColor(null);
                        setStep('color');
                      }}
                      className={clsx(
                        'w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left',
                        selectedLine?.id === line.id
                          ? 'border-saona-blue bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200'
                      )}
                    >
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{line.name}</p>
                        {line.description && (
                          <p className="text-xs text-gray-500">{line.description}</p>
                        )}
                      </div>
                      {/* Mini color preview */}
                      <div className="flex gap-0.5">
                        {(line.colors || []).slice(0, 8).map((c) => (
                          <div
                            key={c.id}
                            className="w-3.5 h-3.5 rounded-sm border border-gray-100"
                            style={{ backgroundColor: c.hex_code }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Choose color */}
            {selectedLine && (
              <div className={clsx('bg-white rounded-2xl p-5 border-2 transition-all', step === 'color' ? 'border-saona-blue shadow-lg' : 'border-gray-100')}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', selectedColor ? 'bg-saona-blue text-white' : 'bg-gray-100 text-gray-500')}>
                    3
                  </div>
                  <h2 className="font-bold text-gray-800">Elige el color</h2>
                </div>

                {selectedColor && (
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50">
                    <div
                      className="w-12 h-12 rounded-xl shadow border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: selectedColor.hex_code }}
                    />
                    <div>
                      <p className="font-bold text-gray-900">{selectedColor.name}</p>
                      <p className="text-sm text-gray-500 font-mono">{selectedColor.color_code} • {selectedColor.hex_code}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-6 gap-2">
                  {(selectedLine.colors || []).map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      title={`${color.name} (${color.color_code})`}
                      className={clsx(
                        'color-swatch aspect-square rounded-lg border-2',
                        selectedColor?.id === color.id ? 'selected' : 'border-gray-200'
                      )}
                      style={{ backgroundColor: color.hex_code }}
                    />
                  ))}
                </div>

                {/* Color names list */}
                <div className="mt-4 max-h-40 overflow-y-auto space-y-1">
                  {(selectedLine.colors || []).map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={clsx(
                        'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left',
                        selectedColor?.id === color.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      )}
                    >
                      <div
                        className="w-5 h-5 rounded border border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: color.hex_code }}
                      />
                      <span className="text-xs text-gray-700 flex-1">{color.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{color.color_code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            {selectedColor && (
              <a
                href={`https://wa.me/51981272614?text=${encodeURIComponent(`Hola, me gustaría obtener información sobre la pintura ${selectedLine?.name} en el color ${selectedColor.name} (${selectedColor.color_code}).`)}`}
                target="_blank"
                className="block w-full bg-saona-green text-white font-bold text-center py-4 rounded-2xl hover:bg-saona-green-dark transition-colors shadow-lg"
              >
                💬 Pedir cotización por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
