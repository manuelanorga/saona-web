'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '@/lib/supabase';
import { HeroSlide } from '@/types';

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: '1',
    title: 'Calidad superior desde la base hasta el acabado',
    subtitle: 'CONSTRUCCIÓN',
    description: 'Imprimante, Temple y Fragua Saona: alta resistencia, fácil aplicación y resultados duraderos para cada proyecto.',
    image_url: '',
    color_start: '#050E1F',
    color_end: '#0D47A1',
    cta_primary_text: 'Ver productos',
    cta_primary_link: '/productos',
    cta_secondary_text: 'Compra por WhatsApp',
    cta_secondary_link: 'https://wa.me/51981272614',
    sort_order: 1,
    is_active: true,
  },
  {
    id: '2',
    title: 'Potencia tu pintura con solventes de calidad premium',
    subtitle: 'SOLVENTES',
    description: 'Logra acabados perfectos, secado uniforme y el máximo rendimiento en cada aplicación.',
    image_url: '',
    color_start: '#0A2540',
    color_end: '#006064',
    cta_primary_text: 'Ver solventes',
    cta_primary_link: '/productos?cat=solventes',
    cta_secondary_text: 'Contáctanos',
    cta_secondary_link: '/contacto',
    sort_order: 2,
    is_active: true,
  },
  {
    id: '3',
    title: 'Línea decorativa para transformar tus espacios',
    subtitle: 'DECORATIVA',
    description: 'Colores vibrantes, acabados perfectos y máxima durabilidad para interiores y exteriores.',
    image_url: '',
    color_start: '#1A0533',
    color_end: '#1565C0',
    cta_primary_text: 'Explorar colores',
    cta_primary_link: '/pintame',
    cta_secondary_text: 'Ver catálogo',
    cta_secondary_link: '/productos?cat=linea-decorativa',
    sort_order: 3,
    is_active: true,
  },
];

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
        if (data && data.length > 0) setSlides(data);
      } catch (e) {}
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => go(current + 1), 6000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const go = (idx: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((idx + slides.length) % slides.length);
      setTransitioning(false);
    }, 300);
  };

  const slide = slides[current];

  const bgStyle = slide.image_url
    ? {}
    : {
        background: `linear-gradient(135deg, ${slide.color_start || '#050E1F'} 0%, ${slide.color_end || '#0D47A1'} 100%)`,
      };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={bgStyle}>
      {/* Background image */}
      {slide.image_url && (
        <>
          <Image
            src={slide.image_url}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}

      {/* Decorative circles */}
      {!slide.image_url && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-green-500/10 rounded-full blur-2xl" />
        </div>
      )}

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path d="M0,80 C360,20 1080,20 1440,80 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Text */}
          <div className={clsx(
            'transition-all duration-300',
            transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          )}>
            {slide.subtitle && (
              <span className="inline-block text-saona-green font-bold text-xs tracking-widest uppercase mb-4 border border-saona-green/40 rounded-full px-3 py-1">
                {slide.subtitle}
              </span>
            )}
            <h1 className="text-white font-black text-4xl lg:text-5xl xl:text-6xl leading-tight mb-6">
              {slide.title}
            </h1>
            {slide.description && (
              <p className="text-white/70 text-lg mb-8 max-w-xl leading-relaxed">
                {slide.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {slide.cta_primary_text && (
                <Link
                  href={slide.cta_primary_link || '/productos'}
                  className="bg-saona-blue hover:bg-saona-blue-dark text-white font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  {slide.cta_primary_text}
                </Link>
              )}
              {slide.cta_secondary_text && (
                <Link
                  href={slide.cta_secondary_link || 'https://wa.me/51981272614'}
                  target={slide.cta_secondary_link?.startsWith('http') ? '_blank' : undefined}
                  className="bg-saona-green hover:bg-saona-green-dark text-white font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
                >
                  {slide.cta_secondary_text}
                </Link>
              )}
            </div>
          </div>

          {/* Visual placeholder when no image */}
          {!slide.image_url && (
            <div className={clsx(
              'hidden lg:flex items-center justify-center transition-all duration-300',
              transitioning ? 'opacity-0' : 'opacity-100'
            )}>
              <div className="relative">
                <div className="w-80 h-80 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <div className="w-64 h-64 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <div className="text-center">
                      <div className="text-6xl font-black text-white/10">S</div>
                      <p className="text-white/30 text-xs tracking-widest uppercase mt-2">SAONA</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-8 right-0 w-3 h-3 bg-saona-green rounded-full animate-pulse" />
                <div className="absolute bottom-16 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 -right-6 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <button onClick={() => go(current - 1)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={clsx(
                  'rounded-full transition-all duration-300',
                  i === current ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                )}
              />
            ))}
          </div>
          <button onClick={() => go(current + 1)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
