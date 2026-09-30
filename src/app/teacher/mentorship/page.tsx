import AppShell from '@/components/AppShell';
import TeacherMentorshipClient from '@/components/TeacherMentorshipClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function MentorshipPage() {
  const mentorships = await prisma.mentorship.findMany({
    include: {
      student: true,
      teacher: true,
    },
    orderBy: { id: 'desc' },
  });

  return (
    <AppShell>
      <TeacherMentorshipClient mentorships={mentorships} />
    </AppShell>
  );
}
