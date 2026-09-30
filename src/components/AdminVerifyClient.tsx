'use client';

import React, { useState } from 'react';
import { verifyCompetition } from '@/app/actions/competitions';
import { useAuth } from '@/context/AuthContext';
import { FileCheck, CheckCircle2, XCircle, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface AdminVerifyClientProps {
  pendingCompetitions: any[];
  reviewedCompetitions: any[];
}

export default function AdminVerifyClient({
  pendingCompetitions,
  reviewedCompetitions,
}: AdminVerifyClientProps) {
  const { user } = useAuth();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleApprove = async (id: number) => {
    if (!user) return;
    setLoadingId(id);
    setNotification(null);

    const res = await verifyCompetition(id, 'approve', null, user.id);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoadingId(null);
  };

  const handleReject = async (id: number) => {
    if (!user) return;
    setLoadingId(id);
    setNotification(null);

    const res = await verifyCompetition(id, 'reject', rejectReason, user.id);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setRejectId(null);
      setRejectReason('');
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
            <FileCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Kurasi & Moderasi Prestasi</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Verifikasi Usulan Lomba Siswa</h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Tinjau informasi lomba baru yang diajukan oleh siswa. Usulan yang disetujui otomatis terbit di katalog publik dan memberikan reward <strong>+10 XP Kontributor</strong> ke siswa pengusul.
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

      {/* Pending Queue */}
      <div className="card-elite overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>Antrean Menunggu Review</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
              {pendingCompetitions.length} Lomba
            </span>
          </h3>
          <span className="text-[11px] text-slate-400">Target Kurasi &lt; 24 Jam</span>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingCompetitions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              Tidak ada usulan lomba yang menunggu verifikasi saat ini.
            </div>
          ) : (
            pendingCompetitions.map((comp) => {
              const deadlineDate = new Date(comp.deadline).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              return (
                <div key={comp.id} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[#8B0000] text-[10px] font-bold">
                          {comp.categoryName}
                        </span>
                        <span className="text-xs text-slate-400">Tingkat {comp.level}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mt-1">{comp.title}</h4>
                      <p className="text-xs text-slate-500">Penyelenggara: {comp.organizer}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-500 font-medium">
                        Pengusul:{' '}
                        <strong className="text-slate-800">
                          {comp.creator?.name} ({comp.creator?.className || 'Siswa'})
                        </strong>
                      </span>
                      <p className="text-[11px] text-slate-400">Batas Waktu: {deadlineDate}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {comp.description || 'Tidak ada deskripsi tambahan.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3 text-xs">
                      {comp.linkRegistration && (
                        <a
                          href={comp.linkRegistration}
                          target="_blank"
                          rel="noreferrer"
                          className="text-rose-600 font-bold hover:underline"
                        >
                          Lihat Link Pendaftaran ↗
                        </a>
                      )}
                      {comp.guidebookLink && (
                        <a
                          href={comp.guidebookLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 font-semibold hover:underline"
                        >
                          Lihat Guidebook ↗
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(comp.id)}
                        disabled={loadingId === comp.id}
                        className="btn-accent-rose text-xs py-1.5 px-4 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>Setujui (+10 XP ke Siswa)</span>
                      </button>

                      <button
                        onClick={() => setRejectId(comp.id)}
                        className="btn-secondary-white text-xs py-1.5 px-3 text-rose-700 hover:bg-rose-50"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>

                  {/* Reject Reason input dialog */}
                  {rejectId === comp.id && (
                    <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2 mt-2">
                      <label className="text-xs font-bold text-rose-900">
                        Alasan Penolakan untuk Siswa Pengusul:
                      </label>
                      <input
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Contoh: Tautan pendaftaran sudah kedaluwarsa atau tidak valid..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-rose-300 rounded-lg focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRejectId(null)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(comp.id)}
                          disabled={loadingId === comp.id}
                          className="px-3 py-1 rounded-lg bg-rose-700 text-white text-xs font-bold hover:bg-rose-800"
                        >
                          Kirim Penolakan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recently Approved / Published Competitions */}
      <div className="card-elite overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">
            Riwayat Lomba Aktif di Katalog Publik ({reviewedCompetitions.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {reviewedCompetitions.map((comp) => (
            <div key={comp.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <h5 className="font-bold text-slate-800">{comp.title}</h5>
                <p className="text-[11px] text-slate-400">
                  {comp.organizer} • Tingkat {comp.level}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Terbit Publik
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
