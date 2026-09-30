'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Video,
  FileText,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface LearnCatalogClientProps {
  materials: any[];
}

export default function LearnCatalogClient({ materials }: LearnCatalogClientProps) {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'doc'>('all');

  const filteredMaterials = materials.filter((mat) => {
    if (activeFilter === 'video') return mat.type === 'youtube';
    if (activeFilter === 'doc') return mat.type === 'word' || mat.type === 'pdf';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ruang Belajar Multimedia & Modul Terpadu</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Ruang Belajar Mandiri Pelajar</h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Pelajari materi video YouTube bebas distraksi dan e-modul dokumen Word/PDF dari guru.
              Setiap materi yang Anda selesaikan akan ditandai dengan status <strong>SELESAI ✅</strong> dan memperoleh <strong>+3 XP</strong>!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center shrink-0">
            <span className="text-2xl font-black text-amber-300">+3 XP</span>
            <p className="text-[11px] text-rose-100 font-semibold">Per Materi Selesai</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs w-fit">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeFilter === 'all'
              ? 'bg-[#8B0000] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Semua Materi ({materials.length})
        </button>
        <button
          onClick={() => setActiveFilter('video')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
            activeFilter === 'video'
              ? 'bg-[#8B0000] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-rose-500" />
          <span>Video YouTube ({materials.filter((m) => m.type === 'youtube').length})</span>
        </button>
        <button
          onClick={() => setActiveFilter('doc')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
            activeFilter === 'doc'
              ? 'bg-[#8B0000] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          <span>Modul Word / PDF ({materials.filter((m) => m.type === 'word' || m.type === 'pdf').length})</span>
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((mat) => {
          const isCompleted = user
            ? mat.progresses?.some((p: any) => p.studentId === user.id && p.isCompleted)
            : false;

          const isVideo = mat.type === 'youtube';
          const isWord = mat.type === 'word';
          const isPdf = mat.type === 'pdf';

          return (
            <div
              key={mat.id}
              className={`card-elite overflow-hidden flex flex-col justify-between group transition-all ${
                isCompleted ? 'border-emerald-300 ring-1 ring-emerald-200' : ''
              }`}
            >
              <div>
                {/* Media Thumbnail / Header */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  {isVideo ? (
                    <>
                      <img
                        src={mat.thumbnail || 'https://img.youtube.com/vi/wm5g4U430Qw/hqdefault.jpg'}
                        alt={mat.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Word / PDF Document Banner */
                    <div
                      className={`w-full h-full p-6 flex flex-col justify-between ${
                        isWord
                          ? 'bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white'
                          : 'bg-gradient-to-br from-rose-700 via-red-800 to-slate-900 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          {isWord ? 'Dokumen Word' : 'E-Modul PDF'}
                        </span>
                        <BookOpen className="w-5 h-5 text-white/70" />
                      </div>

                      <div>
                        <p className="text-xs text-white/80 font-mono">Bahan Bacaan & Teori Lomba</p>
                        <h4 className="text-sm font-extrabold line-clamp-2 mt-0.5">{mat.title}</h4>
                      </div>
                    </div>
                  )}

                  {/* STATUS VIDEO / MATERI SELESAI BADGE DI ATAS */}
                  {isCompleted ? (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-lg flex items-center gap-1.5 border border-emerald-300/40 animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SELESAI DILIHAT
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white font-semibold text-[10px]">
                        Belum Selesai
                      </span>
                    </div>
                  )}

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

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Tipe:{' '}
                      <strong className="text-slate-700 uppercase">
                        {isVideo ? 'Video' : isWord ? 'Word' : 'PDF'}
                      </strong>
                    </span>
                    <span>Pengampu: {mat.teacher?.name?.split(',')[0]}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#8B0000] transition-colors">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai (+{mat.xpReward} XP)</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-600">
                      Belum Klaim XP
                    </span>
                  )}

                  <Link
                    href={`/student/learn/${mat.id}`}
                    className={`text-xs py-1.5 px-3.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'btn-accent-rose'
                    }`}
                  >
                    <span>{isCompleted ? 'Pelajari Ulang' : isVideo ? 'Tonton & Klaim' : 'Baca & Klaim'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
