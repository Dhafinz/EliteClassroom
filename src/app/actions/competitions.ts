'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitCompetitionRequest(formData: FormData) {
  try {
    const studentId = Number(formData.get('studentId'));
    const title = String(formData.get('title') || '').trim();
    const organizer = String(formData.get('organizer') || '').trim();
    const level = String(formData.get('level') || 'Nasional');
    const categoryName = String(formData.get('categoryName') || 'Teknologi');
    const type = String(formData.get('type') || 'team');
    const deadlineStr = String(formData.get('deadline') || '');
    const description = String(formData.get('description') || '').trim();
    const linkRegistration = String(formData.get('linkRegistration') || '').trim();
    const guidebookLink = String(formData.get('guidebookLink') || '').trim();
    const poster = String(formData.get('poster') || '').trim() ||
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';

    if (!title || !organizer || !deadlineStr) {
      return { success: false, message: 'Judul, Penyelenggara, dan Batas Waktu wajib diisi.' };
    }

    const deadline = new Date(deadlineStr);

    const competition = await prisma.competition.create({
      data: {
        createdBy: studentId,
        title,
        organizer,
        level,
        categoryName,
        type,
        deadline,
        description,
        linkRegistration,
        guidebookLink,
        poster,
        verificationStatus: 'pending', // Menunggu moderasi
      },
    });

    revalidatePath('/dashboard/student/competitions');
    revalidatePath('/dashboard/admin/competitions/verify');
    return {
      success: true,
      message: 'Usulan lomba berhasil diajukan! Admin akan meninjau usulan Anda dalam waktu 1x24 jam.',
      competition,
    };
  } catch (error) {
    console.error('Error submitting competition request:', error);
    return { success: false, message: 'Gagal mengajukan usulan lomba. Mohon coba lagi.' };
  }
}

export async function verifyCompetition(
  competitionId: number,
  action: 'approve' | 'reject',
  rejectionReason: string | null,
  reviewerId: number
) {
  try {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: { creator: true },
    });

    if (!competition) {
      return { success: false, message: 'Data lomba tidak ditemukan.' };
    }

    if (action === 'approve') {
      await prisma.$transaction(async (tx) => {
        // Update competition status to approved
        await tx.competition.update({
          where: { id: competitionId },
          data: {
            verificationStatus: 'approved',
            approvedBy: reviewerId,
            rejectionReason: null,
          },
        });

        // If created by a student, award +10 XP Scout reward!
        if (competition.creator.role === 'student') {
          await tx.user.update({
            where: { id: competition.createdBy },
            data: {
              xp: { increment: 10 },
            },
          });
        }
      });

      revalidatePath('/dashboard/admin/competitions/verify');
      revalidatePath('/dashboard/student/competitions');
      return {
        success: true,
        message: 'Lomba disetujui, terbit di katalog publik, dan siswa pengusul menerima reward +10 XP! 🎉',
      };
    } else {
      await prisma.competition.update({
        where: { id: competitionId },
        data: {
          verificationStatus: 'rejected',
          approvedBy: reviewerId,
          rejectionReason: rejectionReason || 'Tidak memenuhi kriteria kurasi sekolah.',
        },
      });

      revalidatePath('/dashboard/admin/competitions/verify');
      return { success: true, message: 'Usulan lomba telah ditolak dengan catatan alasan evaluasi.' };
    }
  } catch (error) {
    console.error('Error verifying competition:', error);
    return { success: false, message: 'Gagal memproses verifikasi lomba.' };
  }
}

export async function requestMentorship(
  teacherId: number,
  studentId: number,
  field: string,
  notes: string
) {
  try {
    const mentorship = await prisma.mentorship.create({
      data: {
        teacherId,
        studentId,
        field,
        notes,
        status: 'pending',
      },
    });

    revalidatePath('/dashboard/student/my-competitions');
    revalidatePath('/dashboard/teacher/mentorship');
    return { success: true, message: 'Permohonan bimbingan berhasil dikirim ke Guru Pembimbing! 🚀', mentorship };
  } catch (error) {
    console.error('Error requesting mentorship:', error);
    return { success: false, message: 'Gagal mengirim permohonan bimbingan.' };
  }
}

export async function respondMentorship(
  mentorshipId: number,
  status: 'active' | 'completed' | 'rejected',
  notes?: string
) {
  try {
    const updated = await prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        status,
        ...(notes ? { notes } : {}),
      },
    });

    revalidatePath('/dashboard/teacher/mentorship');
    revalidatePath('/dashboard/student/my-competitions');
    return { success: true, message: `Status bimbingan berhasil diperbarui menjadi ${status}.`, mentorship: updated };
  } catch (error) {
    console.error('Error responding mentorship:', error);
    return { success: false, message: 'Gagal memperbarui status bimbingan.' };
  }
}

export async function createTeam(competitionId: number, leaderId: number, name: string) {
  try {
    // Generate unique 6-character code
    const inviteCode = 'ELT-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          competitionId,
          leaderId,
          name,
          inviteCode,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: newTeam.id,
          userId: leaderId,
          role: 'leader',
        },
      });

      return newTeam;
    });

    revalidatePath('/dashboard/student/my-competitions');
    return { success: true, message: `Tim "${name}" berhasil dibentuk! Kode Undangan: ${inviteCode}`, team };
  } catch (error) {
    console.error('Error creating team:', error);
    return { success: false, message: 'Gagal membentuk tim.' };
  }
}

export async function joinTeam(inviteCode: string, userId: number) {
  try {
    const team = await prisma.team.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() },
      include: { members: true },
    });

    if (!team) {
      return { success: false, message: 'Kode undangan tim tidak valid atau tidak ditemukan.' };
    }

    const alreadyJoined = team.members.some((m) => m.userId === userId);
    if (alreadyJoined) {
      return { success: false, message: 'Anda sudah menjadi anggota di tim ini.' };
    }

    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId,
        role: 'member',
      },
    });

    revalidatePath('/dashboard/student/my-competitions');
    return { success: true, message: `Berhasil bergabung ke tim "${team.name}"! 🤝` };
  } catch (error) {
    console.error('Error joining team:', error);
    return { success: false, message: 'Gagal bergabung ke tim.' };
  }
}
