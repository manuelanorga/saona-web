'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { CheckCheck } from 'lucide-react';

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const mark = async () => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    router.refresh();
  };
  return (
    <button
      onClick={mark}
      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 flex items-center gap-1 transition-colors"
    >
      <CheckCheck className="w-3 h-3" />
      Marcar leído
    </button>
  );
}
