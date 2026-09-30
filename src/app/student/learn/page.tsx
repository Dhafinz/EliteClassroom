import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Video, Sparkles, Play, CheckCircle2, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LearnPage() {
  const materials = await prisma.learningMaterial.findMany({
    include: { teacher: true, progresses: true },
    orderBy: { id: 'desc' },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Gamified Learning Space</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">Ruang Belajar Mandiri Pelajar</h1>
              <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
                Tonton video materi berkualitas pilihan guru langsung di aplikasi tanpa iklan luar.
                Selesaikan setiap materi untuk mengklaim reward <strong>+3 XP</strong> ke profilmu!
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center shrink-0">
              <span className="text-2xl font-black text-amber-300">+{3} XP</span>
              <p className="text-[11px] text-rose-100 font-semibold">Per Video Selesai</p>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((mat) => (
            <div key={mat.id} className="card-elite overflow-hidden flex flex-col group">
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={mat.thumbnail || 'https://img.youtube.com/vi/wm5g4U430Qw/hqdefault.jpg'}
                  alt={mat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="badge-xp-pill px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    +{mat.xpReward} XP
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold">
                    {mat.category}
                  </span>
                </div>
              </div>

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
                    Guru: <strong className="text-slate-700">{mat.teacher?.name?.split(',')[0]}</strong>
                  </span>

                  <Link
                    href={`/student/learn/${mat.id}`}
                    className="btn-accent-rose text-xs py-1 px-3"
                  >
                    Tonton & Belajar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
