'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function sendCompetitionMessage(competitionId: number, userId: number, message: string) {
  try {
    const text = message.trim();
    if (!text) {
      return { success: false, message: 'Pesan tidak boleh kosong.' };
    }

    const newMessage = await prisma.competitionMessage.create({
      data: {
        competitionId,
        userId,
        message: text,
      },
      include: {
        user: true,
      },
    });

    // Notify other team members / creator
    const comp = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: { teams: { include: { members: true } } },
    });

    if (comp) {
      // Create notification for competition creator if different user
      if (comp.createdBy !== userId) {
        await prisma.notification.create({
          data: {
            userId: comp.createdBy,
            title: '💬 Pesan Baru di Lomba Anda',
            message: `${newMessage.user.name}: "${text.length > 50 ? text.substring(0, 50) + '...' : text}"`,
            type: 'chat',
            link: `/student/competitions/${competitionId}`,
          },
        });
      }
    }

    revalidatePath(`/student/competitions/${competitionId}`);
    return { success: true, message: 'Pesan berhasil terkirim!', data: newMessage };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, message: 'Gagal mengirim pesan.' };
  }
}

export async function markNotificationAsRead(notificationId: number) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification read:', error);
    return { success: false };
  }
}

export async function markAllNotificationsAsRead(userId: number) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    return { success: false };
  }
}
