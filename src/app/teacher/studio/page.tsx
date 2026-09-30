import AppShell from '@/components/AppShell';
import TeacherStudioClient from '@/components/TeacherStudioClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function StudioPage() {
  const materials = await prisma.learningMaterial.findMany({
    include: { teacher: true },
    orderBy: { id: 'desc' },
  });

  return (
    <AppShell>
      <TeacherStudioClient initialMaterials={materials} />
    </AppShell>
  );
}
