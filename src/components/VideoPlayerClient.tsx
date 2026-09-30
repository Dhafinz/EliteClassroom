'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { claimMaterialXp } from '@/app/actions/learning';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, CheckCircle2, Video, BookOpen, AlertCircle } from 'lucide-react';

interface VideoPlayerClientProps {
  material: any;
  hasInitiallyCompleted: boolean;
}

export default function VideoPlayerClient({
  material,
  hasInitiallyCompleted,
}: VideoPlayerClientProps) {
  const { user, refreshUserData } = useAuth();
  const [isCompleted, setIsCompleted] = useState(hasInitiallyCompleted);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

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
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F43F5E', '#991B1B', '#F59E0B', '#10B981'],
      });

      // Refresh global user state for Navbar counter
      await refreshUserData();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Embedded In-App Player */}
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

      {/* Action Bar & XP Claim Area */}
      <div className="card-elite p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
              {material.category}
            </span>
            <span className="text-xs text-slate-400">
              Oleh: <strong>{material.teacher?.name}</strong>
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-800">{material.title}</h1>
        </div>

        {/* Claim Button */}
        <div>
          {isCompleted ? (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Materi Selesai (+{material.xpReward} XP Terklaim)</span>
            </div>
          ) : (
            <button
              onClick={handleClaimXp}
              disabled={loading}
              className="btn-accent-rose text-xs py-2.5 px-5 animate-bounce hover:animate-none"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'Memvalidasi...' : `Tandai Selesai & Klaim +${material.xpReward} XP`}</span>
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
          <span>Catatan Pembelajaran & Arahan Guru</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {material.description}
        </p>
      </div>
    </div>
  );
}
