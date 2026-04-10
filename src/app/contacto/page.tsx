'use client';

import { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function ContactoPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      if (error) throw error;
      toast.success('¡Mensaje enviado! Te contactaremos pronto.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Error al enviar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = 'https://wa.me/51981272614?text=Hola, me gustaría obtener más información sobre los productos SAONA.';

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-saona-navy py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-saona-green text-xs font-bold uppercase tracking-widest">Contáctanos</span>
          <h1 className="text-white font-black text-3xl lg:text-4xl mt-2">
            ¿Tienes preguntas? ¿Ideas?
          </h1>
          <p className="text-white/60 mt-2">¡Ponte en contacto con nosotros!</p>
        </div>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-black text-saona-navy text-2xl mb-2">
                  Siempre disponibles para ustedes.
                </h2>
                <p className="text-gray-500 text-sm">
                  Nuestro equipo está listo para asesorarte en la elección del producto ideal para tu proyecto.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-saona-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-saona-blue" />
                  </div>
                  <div>
                    <a href="tel:+51981272614" className="font-bold text-saona-blue text-lg">
                      +51 981 272 614
                    </a>
                    <p className="text-gray-500 text-sm">Llámanos: Lunes – Viernes 9:00 – 18:00</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-saona-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-saona-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Lima</p>
                    <p className="text-gray-500 text-sm">Almacén: Av. Trapiche 2240</p>
                    <p className="text-gray-500 text-sm">Puente Piedra.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-saona-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-saona-blue" />
                  </div>
                  <div>
                    <a href="mailto:gerencia@saona.com.pe" className="font-bold text-gray-800 block hover:text-saona-blue transition-colors">
                      gerencia@saona.com.pe
                    </a>
                    <a href="mailto:ventas@saona.com.pe" className="font-bold text-gray-800 block hover:text-saona-blue transition-colors">
                      ventas@saona.com.pe
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-saona-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-saona-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Horario de atención</p>
                    <p className="text-gray-500 text-sm">Lunes a Viernes: 9 am – 6 pm</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp button */}
              <a
                href={whatsappUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-saona-green text-white font-bold py-3 rounded-full hover:bg-saona-green-dark transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Escríbenos por WhatsApp
              </a>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="font-black text-saona-navy text-2xl mb-1">Realizar una consulta en línea</h2>
              <p className="text-gray-500 text-sm mb-6">Rellene el siguiente formulario.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Tu nombre"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue focus:ring-2 focus:ring-saona-blue/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue focus:ring-2 focus:ring-saona-blue/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cuéntanos un poco sobre tu proyecto <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe tu proyecto o consulta..."
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saona-blue focus:ring-2 focus:ring-saona-blue/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-saona-blue text-white font-bold py-3.5 rounded-full hover:bg-saona-blue-dark transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
