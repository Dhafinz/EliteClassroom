'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { claimMaterialXp } from '@/app/actions/learning';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  Video,
  FileText,
  BookOpen,
  AlertCircle,
  Download,
} from 'lucide-react';

interface VideoPlayerClientProps {
  material: any;
  hasInitiallyCompleted: boolean;
}

export default function VideoPlayerClient({
  material,
  hasInitiallyCompleted,
}: VideoPlayerClientProps) {
  const { user, refreshUserData, refreshNotifications } = useAuth();

  // Check if current user has completed this material
  const userProgress = user
    ? material.progresses?.some((p: any) => p.studentId === user.id && p.isCompleted)
    : hasInitiallyCompleted;

  const [isCompleted, setIsCompleted] = useState(userProgress || hasInitiallyCompleted);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const isVideo = material.type === 'youtube';
  const isWord = material.type === 'word';
  const isPdf = material.type === 'pdf';

  const handleClaimXp = async () => {
    if (!user) return;
    setLoading(true);
    setNotification(null);

    const res = await claimMaterialXp(user.id, material.id);

    if (res.success) {
      setIsCompleted(true);
      setNotification({ type: 'success', message: res.message });

      // Trigger Celebration Confetti Animation!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F43F5E', '#991B1B', '#F59E0B', '#10B981'],
      });

      // Refresh global user state for Navbar counter and notifications
      await refreshUserData();
      await refreshNotifications();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* STATUS BANNER OUTPUT MENUNJUKKAN SUDAH SELESAI ATAU BELUM */}
      <div
        className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs ${
          isCompleted
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            {isCompleted
              ? `OUTPUT STATUS: SELESAI DIPELAJARI ✅ (Anda telah menyelesaikan materi ini & memperoleh +${material.xpReward} XP)`
              : 'OUTPUT STATUS: BELUM SELESAI ⏳ (Pelajari materi di bawah ini, lalu klik tombol klaim XP)'}
          </span>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
          {isCompleted ? 'Selesai' : 'Sedang Dipelajari'}
        </span>
      </div>

      {/* Embedded Viewport: YouTube Player OR In-App Word/PDF Document Reader */}
      {isVideo ? (
        <div className="rounded-2xl overflow-hidden bg-black aspect-video w-full shadow-2xl border border-slate-800 relative">
          {material.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${material.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
              title={material.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Preview video tidak tersedia
            </div>
          )}
        </div>
      ) : (
        /* IN-APP DOCUMENT READER VIEWPORT FOR WORD / PDF */
        <div className="card-elite p-6 sm:p-8 space-y-6 border-2 border-slate-200 bg-white">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                  isWord ? 'bg-blue-600' : 'bg-red-600'
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Penampil Dokumen Ajar Guru ({isWord ? 'Microsoft Word' : 'Adobe PDF'})
                </span>
                <h2 className="text-base font-bold text-slate-800">{material.title}</h2>
              </div>
            </div>

            <button
              onClick={() => alert(`Mengunduh file: ${material.title}`)}
              className="btn-secondary-white text-xs py-1.5 px-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Dokumen</span>
            </button>
          </div>

          {/* Formatted Document Content Text */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {material.content || material.description}
          </div>
        </div>
      )}

      {/* Action Bar & XP Claim Area */}
      <div className="card-elite p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
              {material.category}
            </span>
            <span className="text-xs text-slate-400">
              Guru Pengampu: <strong>{material.teacher?.name}</strong>
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-800">{material.title}</h1>
        </div>

        {/* Claim Button */}
        <div>
          {isCompleted ? (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Materi Selesai (+{material.xpReward} XP Terklaim)</span>
            </div>
          ) : (
            <button
              onClick={handleClaimXp}
              disabled={loading}
              className="btn-accent-rose text-xs py-2.5 px-5 animate-pulse hover:animate-none shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>
                {loading
                  ? 'Memvalidasi...'
                  : isVideo
                  ? `Tandai Selesai Ditonton & Klaim +${material.xpReward} XP`
                  : `Tandai Selesai Dibaca & Klaim +${material.xpReward} XP`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 ${
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

      {/* Teacher's Notes & Summary */}
      <div className="card-elite p-6 space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <BookOpen className="w-4 h-4 text-[#8B0000]" />
          <span>Rangkuman & Catatan Pembelajaran Guru</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {material.description}
        </p>
      </div>
    </div>
  );
}
