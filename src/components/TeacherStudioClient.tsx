'use client';

import React, { useState } from 'react';
import { createYouTubeMaterial } from '@/app/actions/learning';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Video, Sparkles, PlusCircle, CheckCircle2, AlertCircle, Play } from 'lucide-react';

interface TeacherStudioClientProps {
  initialMaterials: any[];
}

export default function TeacherStudioClient({ initialMaterials }: TeacherStudioClientProps) {
  const { user } = useAuth();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const videoId = extractYouTubeId(youtubeUrl);
  const liveThumbnail = videoId ? getYouTubeThumbnail(videoId) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    formData.append('teacherId', String(user.id));

    const res = await createYouTubeMaterial(formData);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setYoutubeUrl('');
      // Reset form
      (e.target as HTMLFormElement).reset();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
            <Video className="w-3.5 h-3.5 text-amber-300" />
            <span>Studio YouTube HD Guru</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Terbitkan Materi Video Belajar</h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Cukup masukkan link video YouTube. Sistem akan otomatis mem-parsing Video ID dan menampilkan thumbnail resolusi tinggi di beranda siswa secara instan!
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

      {/* Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 card-elite p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[#8B0000]" />
            <span>Formulir Input YouTube Baru</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tautan URL Video YouTube *</label>
              <input
                name="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                required
                placeholder="https://www.youtube.com/watch?v=wm5g4U430Qw atau https://youtu.be/..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400">
                Sistem otomatis mengekstrak ID video dan mengunduh thumbnail kualitas HD.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Judul Materi Pembelajaran *</label>
              <input
                name="title"
                required
                placeholder="Contoh: Belajar Arsitektur Next.js 15 untuk Lomba Web"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kategori / Bidang</label>
                <select
                  name="category"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                >
                  <option value="Teknologi">Teknologi & RPL</option>
                  <option value="Desain">Desain Grafis & UI/UX</option>
                  <option value="Sains & Logika">Sains & Logika</option>
                  <option value="Bisnis">Bisnis & Startup</option>
                  <option value="Umum">Umum & Motivasi Lomba</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Reward Klaim XP (Default: 3 XP)</label>
                <input
                  type="number"
                  name="xpReward"
                  defaultValue={3}
                  min={1}
                  max={20}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Deskripsi & Catatan Guru untuk Siswa</label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Tuliskan rangkuman pokok materi, tugas latihan, atau poin penting yang wajib disimak siswa..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-crimson text-xs py-2.5 px-6 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{loading ? 'Menerbitkan...' : 'Terbitkan Video Sekarang'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Card Preview */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Live Preview Kartu di Beranda Siswa
          </h3>

          <div className="card-elite overflow-hidden border-2 border-rose-200">
            <div className="relative aspect-video w-full bg-slate-900">
              {liveThumbnail ? (
                <img
                  src={liveThumbnail}
                  alt="Live Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                  <Video className="w-8 h-8 mb-1.5 text-slate-600" />
                  <span>Masukkan URL YouTube untuk melihat live thumbnail otomatis</span>
                </div>
              )}

              {liveThumbnail && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 ml-0.5 fill-white" />
                  </div>
                </div>
              )}

              <div className="absolute top-2.5 right-2.5">
                <span className="badge-xp-pill px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  +3 XP
                </span>
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Preview Kartu Siswa
              </span>
              <p className="text-xs font-bold text-slate-800 line-clamp-2">
                Format Visual Elegan (Bukan Link URL Mentah)
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Siswa dapat menonton langsung di web tanpa distraksi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
