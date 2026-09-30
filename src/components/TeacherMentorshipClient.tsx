'use client';

import React, { useState } from 'react';
import { respondMentorship } from '@/app/actions/competitions';
import { Users, CheckCircle2, Clock, MessageSquare, AlertCircle } from 'lucide-react';

interface TeacherMentorshipClientProps {
  mentorships: any[];
}

export default function TeacherMentorshipClient({ mentorships }: TeacherMentorshipClientProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleRespond = async (id: number, status: 'active' | 'completed' | 'rejected') => {
    setLoadingId(id);
    setNotification(null);

    const res = await respondMentorship(id, status);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Mentorship Hub Pendidik</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Manajemen Bimbingan Lomba Siswa</h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Kelola permohonan bimbingan lomba dari siswa, pantau persiapan karya, dan berikan arahan kurikulum kompetisi secara terpusat.
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="card-elite overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Daftar Permohonan Bimbingan Siswa ({mentorships.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {mentorships.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              Belum ada permohonan bimbingan lomba yang masuk.
            </div>
          ) : (
            mentorships.map((m) => (
              <div key={m.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">{m.student.name}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({m.student.className || 'Pelajar'}) • NIS: {m.student.nisNip}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#8B0000]">
                    Bidang: {m.field}
                  </p>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    &quot;{m.notes || 'Siswa mengajukan pendampingan untuk persiapan kompetisi.'}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {m.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleRespond(m.id, 'active')}
                        disabled={loadingId === m.id}
                        className="btn-accent-rose text-xs py-1.5 px-3.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Terima Bimbingan</span>
                      </button>
                      <button
                        onClick={() => handleRespond(m.id, 'rejected')}
                        disabled={loadingId === m.id}
                        className="btn-secondary-white text-xs py-1.5 px-3"
                      >
                        Tolak
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Status: Aktif Membimbing
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
