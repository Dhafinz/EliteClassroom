'use client';

import React, { useState } from 'react';
import { createYouTubeMaterial, createDocumentMaterial } from '@/app/actions/learning';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  Video,
  FileText,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Play,
  BookOpen,
} from 'lucide-react';

interface TeacherStudioClientProps {
  initialMaterials: any[];
}

export default function TeacherStudioClient({ initialMaterials }: TeacherStudioClientProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'youtube' | 'document'>('youtube');

  // YouTube form state
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const videoId = extractYouTubeId(youtubeUrl);
  const liveThumbnail = videoId ? getYouTubeThumbnail(videoId) : null;

  const handleYouTubeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      (e.target as HTMLFormElement).reset();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoading(false);
  };

  const handleDocumentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    formData.append('teacherId', String(user.id));

    const res = await createDocumentMaterial(formData);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
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
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Studio Materi Pembelajaran Guru</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Studio Konten & E-Modul Pembelajaran</h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Pilih metode belajar yang ingin Anda sajikan: terbitkan video pembelajaran YouTube dengan thumbnail otomatis atau unggah bahan bacaan modul berformat <strong>Microsoft Word / Dokumen PDF</strong>.
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

      {/* Method Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs w-fit">
        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'youtube'
              ? 'bg-[#8B0000] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>1. Terbitkan Video YouTube</span>
        </button>

        <button
          onClick={() => setActiveTab('document')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'document'
              ? 'bg-[#8B0000] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Terbitkan E-Modul Word / PDF</span>
        </button>
      </div>

      {/* TAB 1: YOUTUBE IMPORTER */}
      {activeTab === 'youtube' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-elite p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#8B0000]" />
              <span>Formulir Input YouTube Baru</span>
            </h2>

            <form onSubmit={handleYouTubeSubmit} className="space-y-4">
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
              Live Preview Kartu Siswa
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
                    <span>Masukkan URL YouTube untuk melihat live thumbnail</span>
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
                  Format YouTube HD
                </span>
                <p className="text-xs font-bold text-slate-800 line-clamp-2">
                  Tampil Elegan dengan Thumbnail Otomatis
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORD & PDF DOCUMENT PUBLISHER */}
      {activeTab === 'document' && (
        <div className="card-elite p-6 space-y-4 max-w-3xl">
          <h2 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Terbitkan Dokumen Ajar (Microsoft Word / Adobe PDF)</span>
          </h2>

          <form onSubmit={handleDocumentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Format Dokumen *</label>
                <select
                  name="format"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                >
                  <option value="word">📄 Dokumen Microsoft Word (.docx)</option>
                  <option value="pdf">📑 E-Modul Adobe PDF (.pdf)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kategori Bidang</label>
                <select
                  name="category"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                >
                  <option value="Teknologi">Teknologi & IT</option>
                  <option value="Desain">Desain Grafis & UI/UX</option>
                  <option value="Sains & Logika">Sains & Logika</option>
                  <option value="Bisnis">Bisnis & Startup</option>
                  <option value="Umum">Umum & Panduan Lomba</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Judul Dokumen Materi *</label>
              <input
                name="title"
                required
                placeholder="Contoh: Modul Penulisan Proposal & Sistematika Lomba IT 2026"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Deskripsi Singkat Dokumen</label>
              <input
                name="description"
                placeholder="Jelaskan ringkasan materi yang ada di dalam file dokumen ini..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Isi / Teks Naskah Dokumen (Tampil di In-App Reader Siswa) *
              </label>
              <textarea
                name="content"
                rows={6}
                required
                placeholder="Tuliskan naskah materi lengkap, panduan bab per bab, instruksi lomba, atau rangkuman teori yang dapat dibaca langsung oleh siswa di browser..."
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-accent-rose text-xs py-2.5 px-6 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{loading ? 'Menerbitkan...' : 'Terbitkan Dokumen (+3 XP Siswa)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
