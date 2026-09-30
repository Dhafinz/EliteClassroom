import AppShell from '@/components/AppShell';
import QuizArenaClient from '@/components/QuizArenaClient';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quizId = Number(id);

  if (isNaN(quizId)) {
    notFound();
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-4 max-w-5xl mx-auto">
        <Link
          href="/student/quiz"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#8B0000] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Kuis</span>
        </Link>

        <QuizArenaClient quiz={quiz} />
      </div>
    </AppShell>
  );
}
