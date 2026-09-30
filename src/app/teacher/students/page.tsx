import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { getLevelInfo } from '@/lib/types';
import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TeacherStudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: 'student' },
    include: {
      materialProgresses: true,
      quizAttempts: true,
    },
    orderBy: { xp: 'desc' },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Monitoring Kemajuan Belajar Siswa</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Rekapitulasi Capaian & XP Siswa</h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Pantau keaktifan siswa binaan Anda dalam menyimak materi video YouTube, hasil pengerjaan kuis, dan akumulasi total XP.
            </p>
          </div>
        </div>

        <div className="card-elite overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Data Siswa Binaan ({students.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">Nama Siswa</th>
                  <th className="p-4">Kelas & NIS</th>
                  <th className="p-4">Materi Video Selesai</th>
                  <th className="p-4">Kuis Dikerjakan</th>
                  <th className="p-4">Tingkat Level</th>
                  <th className="p-4 text-right">Akumulasi XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((std) => {
                  const level = getLevelInfo(std.xp);
                  const completedVideos = std.materialProgresses.filter((p) => p.isCompleted).length;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-800 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-[#8B0000] flex items-center justify-center font-bold text-xs">
                          {std.name.charAt(0)}
                        </div>
                        <span>{std.name}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-700">{std.className || 'Pelajar'}</p>
                        <p className="text-[11px] text-slate-400">NIS: {std.nisNip || '-'}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {completedVideos} Video
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-700">
                          {std.quizAttempts.length} Percobaan
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 font-bold text-[10px]">
                          {level.badge}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-sm font-black text-[#8B0000]">
                          {std.xp} XP
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
