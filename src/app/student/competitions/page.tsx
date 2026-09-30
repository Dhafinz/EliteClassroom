import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Trophy, Clock, PlusCircle, ArrowRight, Users, User, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CompetitionsPage() {
  const competitions = await prisma.competition.findMany({
    where: { verificationStatus: 'approved' },
    include: {
      creator: true,
      teams: true,
      messages: true,
    },
    orderBy: { deadline: 'asc' },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Akselerasi Prestasi & Kompetisi</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Katalog Lomba Resmi Sekolah</h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Temukan kompetisi yang sesuai minat bakatmu, cari rekan satu tim melalui <strong>Kolom Chat Lomba</strong>, dan ajukan bimbingan intensif kepada guru pembimbing.
            </p>
          </div>

          <Link
            href="/student/competitions/submit"
            className="btn-accent-rose text-xs py-2.5 px-4 shadow-lg shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Usulkan Lomba Baru (+10 XP)</span>
          </Link>
        </div>

        {/* Competitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((comp) => {
            const deadlineDate = new Date(comp.deadline).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            const isTeam = comp.type === 'team';

            return (
              <div key={comp.id} className="card-elite overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={comp.poster || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
                      alt={comp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    {/* TOP LEFT: TULISAN "TIM" ATAU "INDIVIDU" */}
                    <div className="absolute top-3 left-3">
                      {isTeam ? (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#991B1B] to-[#F43F5E] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-white/20">
                          <Users className="w-3.5 h-3.5" />
                          TIM
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-white/20">
                          <User className="w-3.5 h-3.5" />
                          INDIVIDU
                        </span>
                      )}
                    </div>

                    {/* TOP RIGHT: Category */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-800 font-bold text-[10px]">
                        {comp.categoryName}
                      </span>
                    </div>

                    {/* Title inside image banner */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-sm font-extrabold leading-snug line-clamp-2">
                        {comp.title}
                      </h3>
                      <p className="text-[11px] text-rose-200 mt-0.5 truncate">
                        Penyelenggara: {comp.organizer}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* KEBUTUHAN LOMBA */}
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                        Kebutuhan Lomba:
                      </span>
                      <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">
                        {comp.teamRequirement || (isTeam ? '3 Orang Anggota Tim' : '1 Peserta Individu')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {deadlineDate}
                    </span>

                    <Link
                      href={`/student/competitions/${comp.id}`}
                      className="btn-primary-crimson text-xs py-1.5 px-3.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat & Tim</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
