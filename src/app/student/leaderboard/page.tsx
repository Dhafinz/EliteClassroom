import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { getLevelInfo } from '@/lib/types';
import { Trophy, Award, Sparkles, Medal } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const students = await prisma.user.findMany({
    where: { role: 'student' },
    orderBy: { xp: 'desc' },
  });

  const top3 = students.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Leaderboard Sekolah Terpadu</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Papan Peringkat Prestasi & Belajar</h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Peringkat reputasi dihitung secara adil berdasarkan akumulasi <strong>XP Belajar Mandiri</strong>, perolehan medali juara lomba, dan kontribusi usulan lomba baru.
            </p>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {top3.map((student, idx) => {
            const level = getLevelInfo(student.xp);
            const isFirst = idx === 0;
            const rankLabel = isFirst ? 'Juara 1' : idx === 1 ? 'Juara 2' : 'Juara 3';
            const crownColor = isFirst
              ? 'from-amber-400 to-amber-600 border-amber-300'
              : idx === 1
              ? 'from-slate-200 to-slate-400 border-slate-300'
              : 'from-amber-600 to-orange-700 border-amber-500';

            return (
              <div
                key={student.id}
                className={`card-elite p-6 text-center space-y-3 relative overflow-hidden ${
                  isFirst ? 'ring-2 ring-amber-400 shadow-xl' : ''
                }`}
              >
                <div className="flex justify-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${crownColor} text-white flex items-center justify-center font-black text-xl shadow-md border-2`}
                  >
                    #{idx + 1}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
                    {rankLabel}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 leading-snug mt-0.5">
                    {student.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {student.className || 'Siswa Berprestasi'}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 font-black text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{student.xp} XP</span>
                </div>

                <p className="text-[10px] font-bold text-slate-500">{level.title}</p>
              </div>
            );
          })}
        </div>

        {/* Full Rankings Table */}
        <div className="card-elite overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Daftar Peringkat Lengkap</h3>
            <span className="text-xs text-slate-500">{students.length} Siswa Terdaftar</span>
          </div>

          <div className="divide-y divide-slate-100">
            {students.map((std, index) => {
              const level = getLevelInfo(std.xp);

              return (
                <div
                  key={std.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 font-black text-slate-400 text-sm text-center">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B0000] to-[#F43F5E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {std.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{std.name}</h4>
                      <p className="text-xs text-slate-400">
                        {std.className || 'Pelajar'} • NIS: {std.nisNip || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {level.badge}
                    </span>
                    <span className="text-sm font-black text-[#8B0000]">{std.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
