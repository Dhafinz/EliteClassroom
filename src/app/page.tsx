import AppShell from '@/components/AppShell';
import DashboardView from '@/components/DashboardView';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [initialMaterials, initialCompetitions, initialQuizzes, initialMentorships, topStudents] =
    await Promise.all([
      prisma.learningMaterial.findMany({
        include: { teacher: true, progresses: true },
        orderBy: { id: 'desc' },
      }),
      prisma.competition.findMany({
        include: { creator: true, teams: true },
        orderBy: { id: 'desc' },
      }),
      prisma.quiz.findMany({
        include: { teacher: true, questions: true },
        orderBy: { id: 'desc' },
      }),
      prisma.mentorship.findMany({
        include: { teacher: true, student: true },
        orderBy: { id: 'desc' },
      }),
      prisma.user.findMany({
        where: { role: 'student' },
        orderBy: { xp: 'desc' },
        take: 5,
      }),
    ]);

  return (
    <AppShell>
      <DashboardView
        initialMaterials={initialMaterials}
        initialCompetitions={initialCompetitions}
        initialQuizzes={initialQuizzes}
        initialMentorships={initialMentorships}
        topStudents={topStudents}
      />
    </AppShell>
  );
}
