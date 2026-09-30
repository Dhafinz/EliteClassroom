'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getLevelInfo } from '@/lib/types';
import {
  Trophy,
  Video,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  FileCheck,
  Award,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  initialMaterials: any[];
  initialCompetitions: any[];
  initialQuizzes: any[];
  initialMentorships: any[];
  topStudents: any[];
}

export default function DashboardView({
  initialMaterials,
  initialCompetitions,
  initialQuizzes,
  initialMentorships,
  topStudents,
}: DashboardViewProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'quizzes' | 'comps'>('all');

  const levelInfo = user ? getLevelInfo(user.xp) : null;
  const progressPercent = levelInfo
    ? Math.min(
        100,
        Math.max(
          10,
          Math.round(((user!.xp - levelInfo.minXp) / (levelInfo.maxXp - levelInfo.minXp)) * 100)
        )
      )
    : 0;

  // Filter materials & competitions
  const approvedCompetitions = initialCompetitions.filter(
    (c) => c.verificationStatus === 'approved'
  );
  const pendingCompetitions = initialCompetitions.filter(
    (c) => c.verificationStatus === 'pending'
  );
  const mySubmittedComps = initialCompetitions.filter(
    (c) => user && c.createdBy === user.id
  );

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 1. HERO BANNER DINAMIS BERDASARKAN ROLE */}
      {/* ============================================================ */}
      <div className="hero-crimson rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-950/20 relative">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-rose-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {user?.role === 'student'
                    ? 'Ekosistem Belajar & Prestasi Pelajar'
                    : user?.role === 'teacher'
                    ? 'Studio Bimbingan & Konten Guru'
                    : user?.role === 'admin'
                    ? 'Pusat Kurasi & Manajemen Sekolah'
                    : 'Developer Monitoring Center'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Halo, {user?.name || 'Sobat Prestasi'}! 👋
              </h1>
              <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
                {user?.role === 'student'
                  ? 'Tonton materi video pembelajaran (+3 XP), kerjakan kuis tantangan, usulkan lomba impianmu, dan raih bimbingan intensif dari guru untuk jadi juara!'
                  : user?.role === 'teacher'
                  ? 'Bagikan video pembelajaran YouTube dengan thumbnail otomatis, buat kuis interaktif, dan kawal tim siswa binaan Anda hingga podium juara!'
                  : user?.role === 'admin'
                  ? 'Kelola antrean verifikasi usulan lomba siswa, pantau capaian prestasi medali, dan kelola akun pengguna sekolah.'
                  : 'Pantau metrik kesehatan backend Next.js, database SQLite (dev.db), latensi, dan log keamanan sistem.'}
              </p>
            </div>

            {/* Student XP Level Card */}
            {user?.role === 'student' && levelInfo && (
              <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[260px] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-rose-200 font-medium">Status Level Siswa</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/40 text-amber-200 border border-amber-300/30">
                    {levelInfo.badge}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{user.xp}</span>
                  <span className="text-xs font-semibold text-rose-200">/ {levelInfo.maxXp} XP</span>
                </div>
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-rose-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-rose-200 font-medium">
                    <span>{levelInfo.title}</span>
                    <span>{progressPercent}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Teacher Quick Stats */}
            {user?.role === 'teacher' && (
              <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[260px] grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white/10">
                  <p className="text-2xl font-black text-white">{initialMaterials.length}</p>
                  <p className="text-[11px] text-rose-200">Materi Terbit</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10">
                  <p className="text-2xl font-black text-amber-300">{initialMentorships.length}</p>
                  <p className="text-[11px] text-rose-200">Siswa Bimbingan</p>
                </div>
              </div>
            )}

            {/* Admin Quick Stats */}
            {user?.role === 'admin' && (
              <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[260px] text-center space-y-2">
                <div className="p-2.5 rounded-xl bg-white/10 flex items-center justify-between">
                  <span className="text-xs text-rose-200">Usulan Lomba Pending</span>
                  <span className="text-xl font-black text-amber-300">{pendingCompetitions.length}</span>
                </div>
                <Link
                  href="/admin/competitions/verify"
                  className="block w-full py-1.5 px-3 bg-white text-[#8B0000] text-xs font-bold rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Buka Antrean Verifikasi →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. QUICK TABS & TOMBOL AKSI CEPAT */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-[#8B0000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Semua Konten
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'videos'
                ? 'bg-[#8B0000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-500" />
            Video Belajar (+3 XP)
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'quizzes'
                ? 'bg-[#8B0000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
            Kuis Tantangan
          </button>
          <button
            onClick={() => setActiveTab('comps')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'comps'
                ? 'bg-[#8B0000] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Katalog Lomba
          </button>
        </div>

        {/* Primary Action Button */}
        {user?.role === 'student' ? (
          <Link
            href="/student/competitions/submit"
            className="btn-accent-rose text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Usulkan Lomba Baru (+10 XP)</span>
          </Link>
        ) : user?.role === 'teacher' ? (
          <Link
            href="/teacher/studio"
            className="btn-primary-crimson text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Terbitkan Video YouTube</span>
          </Link>
        ) : (
          <Link
            href="/admin/competitions/verify"
            className="btn-primary-crimson text-xs"
          >
            <FileCheck className="w-4 h-4" />
            <span>Tinjau Usulan Siswa ({pendingCompetitions.length})</span>
          </Link>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. SECTION VIDEO YOUTUBE & RUANG BELAJAR */}
      {/* ============================================================ */}
      {(activeTab === 'all' || activeTab === 'videos') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-gradient-to-b from-[#8B0000] to-[#F43F5E] rounded-full"></div>
              <h2 className="text-lg font-extrabold text-slate-800">
                Ruang Belajar Mandiri: Video Materi Guru
              </h2>
            </div>
            <Link
              href="/student/learn"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
            >
              <span>Lihat Semua Materi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {initialMaterials.slice(0, 3).map((mat) => {
              const hasCompleted = user
                ? mat.progresses?.some(
                    (p: any) => p.studentId === user.id && p.isCompleted
                  )
                : false;

              return (
                <div key={mat.id} className="card-elite overflow-hidden flex flex-col group">
                  {/* YouTube Thumbnail Preview */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <img
                      src={mat.thumbnail || 'https://img.youtube.com/vi/wm5g4U430Qw/hqdefault.jpg'}
                      alt={mat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                    {/* Play Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </div>
                    </div>

                    {/* XP Reward Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="badge-xp-pill px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        +{mat.xpReward} XP
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold">
                        {mat.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#8B0000] transition-colors">
                        {mat.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {mat.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Pengampu: <span className="text-slate-700 font-semibold">{mat.teacher?.name?.split(',')[0]}</span>
                      </span>

                      {hasCompleted ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai
                        </span>
                      ) : (
                        <Link
                          href={`/student/learn/${mat.id}`}
                          className="text-xs font-bold text-[#8B0000] hover:text-rose-600 transition-colors"
                        >
                          Tonton & Klaim XP →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. SECTION LOMBA UNGGULAN & KATALOG KOMPETISI */}
      {/* ============================================================ */}
      {(activeTab === 'all' || activeTab === 'comps') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-gradient-to-b from-[#8B0000] to-amber-500 rounded-full"></div>
              <h2 className="text-lg font-extrabold text-slate-800">
                Katalog Kompetisi & Prestasi Pilihan
              </h2>
            </div>
            <Link
              href="/student/competitions"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
            >
              <span>Eksplorasi Seluruh Lomba</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {approvedCompetitions.slice(0, 3).map((comp) => {
              const deadlineDate = new Date(comp.deadline).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div key={comp.id} className="card-elite overflow-hidden flex flex-col group">
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={comp.poster}
                      alt={comp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    {/* Level Pill */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                        {comp.level}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-800 font-bold text-[10px]">
                        {comp.categoryName}
                      </span>
                    </div>

                    {/* Title inside image banner */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-sm font-extrabold leading-snug line-clamp-2">
                        {comp.title}
                      </h3>
                      <p className="text-[11px] text-rose-200 mt-0.5 truncate">
                        Oleh: {comp.organizer}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        Deadline: <strong className="text-slate-700">{deadlineDate}</strong>
                      </span>

                      <Link
                        href={`/student/competitions/${comp.id}`}
                        className="px-3 py-1 bg-rose-50 text-[#8B0000] font-bold text-xs rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        Bimbingan & Tim →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 5. CROWDSOURCED USULAN LOMBA SISWA STATUS TRACKER */}
      {/* ============================================================ */}
      {user?.role === 'student' && mySubmittedComps.length > 0 && (
        <section className="p-5 rounded-2xl bg-white border border-rose-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Status Usulan Lomba Baru Saya ({mySubmittedComps.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Reward +10 XP saat disetujui</span>
          </div>

          <div className="divide-y divide-slate-100">
            {mySubmittedComps.map((comp) => (
              <div key={comp.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{comp.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">Penyelenggara: {comp.organizer}</p>
                </div>
                <div>
                  {comp.verificationStatus === 'pending' ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Menunggu Review Admin
                    </span>
                  ) : comp.verificationStatus === 'approved' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Disetujui (+10 XP)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Ditolak: {comp.rejectionReason}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 6. PREVIEW LEADERBOARD & PODIUM JUARA */}
      {/* ============================================================ */}
      <section className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                Leaderboard Reputasi Prestasi & Belajar
              </h3>
              <p className="text-xs text-slate-400">
                Peringkat gabungan dari akumulasi XP Belajar Mandiri dan Medali Juara Lomba
              </p>
            </div>
          </div>
          <Link
            href="/student/leaderboard"
            className="text-xs font-bold text-rose-600 hover:text-rose-700"
          >
            Lihat Papan Peringkat Penuh →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topStudents.slice(0, 3).map((std, idx) => {
            const medalColor =
              idx === 0
                ? 'from-amber-400 to-amber-600 text-white'
                : idx === 1
                ? 'from-slate-300 to-slate-500 text-white'
                : 'from-amber-600 to-orange-700 text-white';

            const crownIcon = idx === 0 ? '👑 #1' : idx === 1 ? '🥈 #2' : '🥉 #3';

            return (
              <div
                key={std.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${medalColor} flex items-center justify-center font-black text-xs shadow-sm`}
                  >
                    {crownIcon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                      {std.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{std.className || 'Pelajar'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#8B0000]">{std.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
