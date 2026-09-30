import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { HelpCircle, Clock, Sparkles, Award, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function QuizListPage() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      teacher: true,
      questions: true,
      attempts: {
        orderBy: { score: 'desc' },
        take: 1,
      },
    },
    orderBy: { id: 'desc' },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Studio Evaluasi & Tantangan Kuis</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Kuis Interaktif & Scoring Otomatis</h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Uji pemahaman teorimu dengan timer hitung mundur. Dapatkan nilai langsung dan bonus reward hingga <strong>+10 XP</strong> untuk nilai sempurna!
            </p>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quizzes.map((quiz) => {
            const questionCount = quiz.questions.length;

            return (
              <div key={quiz.id} className="card-elite p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#8B0000] border border-rose-200 text-[10px] font-bold">
                      {quiz.category}
                    </span>
                    <span className="badge-xp-pill px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      +{quiz.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 leading-snug">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {quiz.timeLimit} Menit
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                      {questionCount} Soal Pilihan Ganda
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Guru: <strong>{quiz.teacher?.name?.split(',')[0]}</strong>
                  </span>
                  <Link
                    href={`/student/quiz/${quiz.id}`}
                    className="btn-accent-rose text-xs py-1.5 px-4"
                  >
                    <span>Mulai Kuis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
