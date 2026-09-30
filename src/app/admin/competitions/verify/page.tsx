import AppShell from '@/components/AppShell';
import AdminVerifyClient from '@/components/AdminVerifyClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminVerifyPage() {
  const [pendingCompetitions, reviewedCompetitions] = await Promise.all([
    prisma.competition.findMany({
      where: { verificationStatus: 'pending' },
      include: { creator: true },
      orderBy: { id: 'desc' },
    }),
    prisma.competition.findMany({
      where: { verificationStatus: 'approved' },
      include: { creator: true },
      orderBy: { id: 'desc' },
      take: 10,
    }),
  ]);

  return (
    <AppShell>
      <AdminVerifyClient
        pendingCompetitions={pendingCompetitions}
        reviewedCompetitions={reviewedCompetitions}
      />
    </AppShell>
  );
}
