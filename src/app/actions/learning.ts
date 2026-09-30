'use server';

import { prisma } from '@/lib/prisma';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function claimMaterialXp(studentId: number, materialId: number) {
  try {
    // Check if student already claimed XP for this material
    const existing = await prisma.materialProgress.findUnique({
      where: {
        studentId_materialId: {
          studentId,
          materialId,
        },
      },
    });

    if (existing && existing.isCompleted) {
      return { success: false, message: 'Anda sudah mengklaim reward XP untuk materi ini sebelumnya.' };
    }

    const material = await prisma.learningMaterial.findUnique({
      where: { id: materialId },
    });

    if (!material) {
      return { success: false, message: 'Materi pembelajaran tidak ditemukan.' };
    }

    const xpToAdd = material.xpReward || 3;

    // Use transaction to ensure atomic XP update and progress record
    const result = await prisma.$transaction(async (tx) => {
      const progress = await tx.materialProgress.upsert({
        where: {
          studentId_materialId: {
            studentId,
            materialId,
          },
        },
        update: {
          isCompleted: true,
          xpEarned: xpToAdd,
          completedAt: new Date(),
        },
        create: {
          studentId,
          materialId,
          isCompleted: true,
          xpEarned: xpToAdd,
          completedAt: new Date(),
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: studentId },
        data: {
          xp: {
            increment: xpToAdd,
          },
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: studentId,
          title: '✨ Reward XP Masuk!',
          message: `Selamat! Anda berhasil mengklaim +${xpToAdd} XP dari materi "${material.title}".`,
          type: 'xp',
          link: `/student/learn/${materialId}`,
        },
      });

      return { progress, newXp: updatedUser.xp };
    });

    revalidatePath('/dashboard/student');
    revalidatePath('/student/learn');
    revalidatePath(`/student/learn/${materialId}`);
    return {
      success: true,
      message: `Selamat! +${xpToAdd} XP berhasil ditambahkan ke profil Anda! 🎉`,
      newXp: result.newXp,
    };
  } catch (error) {
    console.error('Error claiming XP:', error);
    return { success: false, message: 'Gagal mengklaim XP. Silakan coba lagi.' };
  }
}

export async function createYouTubeMaterial(formData: FormData) {
  try {
    const teacherId = Number(formData.get('teacherId'));
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const category = String(formData.get('category') || 'Teknologi');
    const youtubeUrl = String(formData.get('youtubeUrl') || '').trim();
    const xpReward = Number(formData.get('xpReward') || 3);

    if (!title || !youtubeUrl) {
      return { success: false, message: 'Judul dan URL YouTube wajib diisi.' };
    }

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      return { success: false, message: 'Format URL YouTube tidak valid. Mohon periksa kembali tautan Anda.' };
    }

    const thumbnail = getYouTubeThumbnail(videoId);

    const newMaterial = await prisma.learningMaterial.create({
      data: {
        teacherId,
        title,
        description,
        type: 'youtube',
        fileFormat: 'video',
        youtubeUrl,
        youtubeId: videoId,
        thumbnail,
        category,
        xpReward,
      },
    });

    revalidatePath('/teacher/studio');
    revalidatePath('/student/learn');
    return { success: true, message: 'Materi video YouTube berhasil diterbitkan!', material: newMaterial };
  } catch (error) {
    console.error('Error creating YouTube material:', error);
    return { success: false, message: 'Terjadi kesalahan saat menyimpan materi.' };
  }
}

export async function createDocumentMaterial(formData: FormData) {
  try {
    const teacherId = Number(formData.get('teacherId'));
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const category = String(formData.get('category') || 'Teknologi');
    const format = String(formData.get('format') || 'word'); // "word" | "pdf"
    const content = String(formData.get('content') || '').trim();
    const fileUrl = String(formData.get('fileUrl') || '').trim();
    const xpReward = Number(formData.get('xpReward') || 3);

    if (!title || (!content && !fileUrl)) {
      return { success: false, message: 'Judul dan konten materi dokumen wajib diisi.' };
    }

    const newMaterial = await prisma.learningMaterial.create({
      data: {
        teacherId,
        title,
        description,
        type: format,
        fileFormat: format,
        category,
        content,
        fileUrl: fileUrl || (format === 'pdf' ? '/docs/panduan.pdf' : '/docs/modul.docx'),
        xpReward,
      },
    });

    revalidatePath('/teacher/studio');
    revalidatePath('/student/learn');
    return {
      success: true,
      message: `Materi dokumen ${format.toUpperCase()} berhasil diterbitkan untuk siswa!`,
      material: newMaterial,
    };
  } catch (error) {
    console.error('Error creating document material:', error);
    return { success: false, message: 'Terjadi kesalahan saat menyimpan materi dokumen.' };
  }
}

export async function submitQuizAttempt(
  studentId: number,
  quizId: number,
  answers: Record<number, string>
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz || quiz.questions.length === 0) {
      return { success: false, message: 'Kuis tidak ditemukan atau belum memiliki soal.' };
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q) => {
      if (answers[q.id] && answers[q.id].toUpperCase() === q.correctKey.toUpperCase()) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    let xpEarned = 0;

    if (score === 100) {
      xpEarned = quiz.xpReward; // e.g. 10 XP
    } else if (score >= 70) {
      xpEarned = Math.round(quiz.xpReward * 0.6); // e.g. 6 XP
    }

    // Record attempt & increment user XP if earned
    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.quizAttempt.create({
        data: {
          studentId,
          quizId,
          score,
          xpEarned,
        },
      });

      let updatedUser = null;
      if (xpEarned > 0) {
        updatedUser = await tx.user.update({
          where: { id: studentId },
          data: {
            xp: { increment: xpEarned },
          },
        });

        // Add notification
        await tx.notification.create({
          data: {
            userId: studentId,
            title: '🏆 Kuis Selesai & XP Diperoleh!',
            message: `Skor Anda ${score}%. Anda memperoleh +${xpEarned} XP dari kuis "${quiz.title}".`,
            type: 'xp',
            link: `/student/quiz/${quizId}`,
          },
        });
      }

      return { attempt, updatedUser };
    });

    revalidatePath('/dashboard/student');
    return {
      success: true,
      score,
      correctCount,
      totalQuestions,
      xpEarned,
      message:
        score >= 70
          ? `Luar biasa! Skor Anda ${score}% dan memperoleh +${xpEarned} XP! 🏆`
          : `Skor Anda ${score}%. Terus belajar dan coba lagi untuk mendapatkan XP! 💪`,
    };
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    return { success: false, message: 'Gagal menyimpan hasil kuis.' };
  }
}
