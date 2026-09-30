import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Users, Clock, CheckCircle2, Trophy, ArrowRight, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MyCompetitionsPage() {
  const [teams, mentorships] = await Promise.all([
    prisma.team.findMany({
      include: {
        competition: true,
        leader: true,
        members: { include: { user: true } },
      },
      orderBy: { id: 'desc' },
    }),
    prisma.mentorship.findMany({
      include: {
        teacher: true,
        student: true,
      },
      orderBy: { id: 'desc' },
    }),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Kolaborasi & Pendampingan</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Tim Lomba & Bimbingan Saya</h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Pantau status tim lomba yang Anda ikuti, bagikan kode undangan ke rekan sekelas, dan pantau catatan bimbingan intensif dari guru pembimbing.
            </p>
          </div>
        </div>

        {/* Section 1: Active Teams */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#8B0000]" />
              <span>Tim Lomba Terdaftar ({teams.length})</span>
            </h2>
            <Link
              href="/student/competitions"
              className="text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              + Cari Lomba Baru
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="card-elite p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[#8B0000] text-[10px] font-bold">
                      {team.competition?.categoryName || 'Kompetisi'}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 mt-1">{team.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{team.competition?.title}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center shrink-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Kode Undangan</p>
                    <p className="text-xs font-black text-[#8B0000] font-mono tracking-wider">
                      {team.inviteCode}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-1.5">
                    Anggota Tim ({team.members.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {team.members.map((m) => (
                      <span
                        key={m.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{m.user.name}</span>
                        {m.role === 'leader' && (
                          <span className="text-[9px] text-[#8B0000] font-bold">(Ketua)</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Mentorship Sessions */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#8B0000]" />
            <span>Status Bimbingan Guru Pembimbing ({mentorships.length})</span>
          </h2>

          <div className="space-y-3">
            {mentorships.map((m) => (
              <div key={m.id} className="card-elite p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Guru Pembimbing: <strong className="text-[#8B0000]">{m.teacher.name}</strong>
                    </span>
                    <span className="text-[11px] text-slate-400">({m.field})</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    &quot;{m.notes || 'Belum ada catatan bimbingan terbaru.'}&quot;
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Siswa: {m.student.name} ({m.student.className || 'Pelajar'})
                  </p>
                </div>

                <div className="shrink-0">
                  {m.status === 'active' ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Bimbingan Aktif
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Menunggu Konfirmasi Guru
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
