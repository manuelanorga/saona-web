import { createAdminClient } from '@/lib/supabase';
import { Mail, MailOpen, Clock } from 'lucide-react';
import MarkReadButton from '@/components/admin/MarkReadButton';

export default async function AdminMensajesPage() {
  const admin = createAdminClient();
  const { data: messages } = await admin
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  const unread = messages?.filter((m) => !m.is_read).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Mensajes de contacto</h1>
        <p className="text-gray-500 text-sm">
          {messages?.length || 0} mensajes totales • {unread} sin leer
        </p>
      </div>

      <div className="space-y-3">
        {(!messages || messages.length === 0) && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay mensajes todavía.</p>
          </div>
        )}
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${msg.is_read ? 'border-gray-100' : 'border-saona-blue'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.is_read ? 'bg-gray-100' : 'bg-saona-blue/10'}`}>
                  {msg.is_read
                    ? <MailOpen className="w-4 h-4 text-gray-400" />
                    : <Mail className="w-4 h-4 text-saona-blue" />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{msg.name}</span>
                    <a href={`mailto:${msg.email}`} className="text-saona-blue text-sm hover:underline">
                      {msg.email}
                    </a>
                    {!msg.is_read && (
                      <span className="bg-saona-blue text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{msg.message}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleString('es-PE')}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!msg.is_read && <MarkReadButton id={msg.id} />}
                <a
                  href={`mailto:${msg.email}?subject=Re: Consulta SAONA`}
                  className="px-3 py-1.5 bg-saona-blue/10 text-saona-blue text-xs font-semibold rounded-lg hover:bg-saona-blue hover:text-white transition-colors"
                >
                  Responder
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
