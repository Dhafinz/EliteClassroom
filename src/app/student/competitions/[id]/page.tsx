import AppShell from '@/components/AppShell';
import CompetitionDetailClient from '@/components/CompetitionDetailClient';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const competitionId = Number(id);

  if (isNaN(competitionId)) {
    notFound();
  }

  const [competition, teachers] = await Promise.all([
    prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        creator: true,
        teams: {
          include: { members: { include: { user: true } } },
        },
        messages: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: 'teacher' },
      select: { id: true, name: true, department: true },
    }),
  ]);

  if (!competition) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-4 max-w-5xl mx-auto">
        <Link
          href="/student/competitions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#8B0000] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Lomba</span>
        </Link>

        <CompetitionDetailClient competition={competition} teachers={teachers} />
      </div>
    </AppShell>
  );
}
