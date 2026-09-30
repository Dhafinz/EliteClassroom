import AppShell from '@/components/AppShell';
import LearnCatalogClient from '@/components/LearnCatalogClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function LearnPage() {
  const materials = await prisma.learningMaterial.findMany({
    include: { teacher: true, progresses: true },
    orderBy: { id: 'desc' },
  });

  return (
    <AppShell>
      <LearnCatalogClient materials={materials} />
    </AppShell>
  );
}
