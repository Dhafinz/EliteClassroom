'use client';

import React, { useState } from 'react';
import { submitCompetitionRequest } from '@/app/actions/competitions';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Sparkles, Trophy, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SubmitCompetitionClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    formData.append('studentId', String(user.id));

    const res = await submitCompetitionRequest(formData);

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoading(false);
  };

  return (
    <div className="card-elite p-6 sm:p-8 space-y-6">
      <div className="space-y-1 pb-4 border-b border-slate-100">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#8B0000] border border-rose-200 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Reward Kontributor: +10 XP saat Disetujui</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800">
          Formulir Usulkan Lomba Baru
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Menemukan informasi lomba di Instagram, web kampus, atau komunitas luar? Daftarkan di sini agar diverifikasi oleh Admin/Guru pembimbing dan dapat diikuti bersama siswa lainnya!
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Nama / Judul Lomba *</label>
            <input
              name="title"
              required
              placeholder="Contoh: Hackathon Nasional IoT & AI Pelajar 2026"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Institusi Penyelenggara *</label>
            <input
              name="organizer"
              required
              placeholder="Contoh: Universitas Indonesia / Kemendikbud"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Bidang / Kategori</label>
            <select
              name="categoryName"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
            >
              <option value="Teknologi & IT">Teknologi & IT</option>
              <option value="Desain Grafis & UI/UX">Desain Grafis & UI/UX</option>
              <option value="Sains & Matematika">Sains & Matematika</option>
              <option value="Bisnis Digital & Startup">Bisnis Digital & Startup</option>
              <option value="Bahasa & Karya Ilmiah">Bahasa & Karya Ilmiah</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Tingkat Kompetisi</label>
            <select
              name="level"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
            >
              <option value="Sekolah">Tingkat Sekolah</option>
              <option value="Kota">Tingkat Kota / Kabupaten</option>
              <option value="Provinsi">Tingkat Provinsi</option>
              <option value="Nasional">Tingkat Nasional</option>
              <option value="Internasional">Tingkat Internasional</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Batas Waktu Pendaftaran *</label>
            <input
              type="date"
              name="deadline"
              required
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Deskripsi & Syarat Lomba</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Jelaskan secara singkat tema lomba, sasaran peserta, dan persyaratan umum..."
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Tautan Web / Formulir Registrasi</label>
            <input
              type="url"
              name="linkRegistration"
              placeholder="https://panitia-lomba.id/daftar"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Tautan Buku Panduan (Guidebook)</label>
            <input
              type="url"
              name="guidebookLink"
              placeholder="https://panitia-lomba.id/panduan.pdf"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">URL Gambar Poster (Opsional)</label>
          <input
            type="url"
            name="poster"
            placeholder="https://example.com/poster.jpg (Bisa dikosongkan untuk poster default)"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-accent-rose text-xs py-2.5 px-6 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Mengirimkan...' : 'Kirim Usulan Lomba'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
