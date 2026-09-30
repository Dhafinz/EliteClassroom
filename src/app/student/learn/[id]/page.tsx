import AppShell from '@/components/AppShell';
import VideoPlayerClient from '@/components/VideoPlayerClient';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const materialId = Number(id);

  if (isNaN(materialId)) {
    notFound();
  }

  const material = await prisma.learningMaterial.findUnique({
    where: { id: materialId },
    include: { teacher: true, progresses: true },
  });

  if (!material) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-4 max-w-4xl mx-auto">
        <Link
          href="/student/learn"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#8B0000] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Ruang Belajar</span>
        </Link>

        <VideoPlayerClient material={material} hasInitiallyCompleted={false} />
      </div>
    </AppShell>
  );
}
