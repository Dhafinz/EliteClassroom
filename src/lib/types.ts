export type UserRole = 'student' | 'teacher' | 'admin' | 'developer';

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  nisNip?: string | null;
  className?: string | null;
  department?: string | null;
  photo?: string | null;
  xp: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  badge: string;
  minXp: number;
  maxXp: number;
  color: string;
}

export function getLevelInfo(xp: number): LevelInfo {
  if (xp >= 700) {
    return {
      level: 5,
      title: 'Bintang Utama (Grand Champion)',
      badge: '👑 Master V',
      minXp: 700,
      maxXp: 1500,
      color: 'from-amber-500 to-rose-600',
    };
  }
  if (xp >= 351) {
    return {
      level: 4,
      title: 'Ahli Prestasi (Master Competitor)',
      badge: '⭐ Level IV',
      minXp: 351,
      maxXp: 700,
      color: 'from-rose-500 to-red-600',
    };
  }
  if (xp >= 151) {
    return {
      level: 3,
      title: 'Pejuang Kompetisi (Contender)',
      badge: '⚔️ Level III',
      minXp: 151,
      maxXp: 350,
      color: 'from-pink-500 to-rose-500',
    };
  }
  if (xp >= 51) {
    return {
      level: 2,
      title: 'Penjelajah (Active Learner)',
      badge: '🚀 Level II',
      minXp: 51,
      maxXp: 150,
      color: 'from-blue-500 to-indigo-600',
    };
  }
  return {
    level: 1,
    title: 'Pemula (Novice Scholar)',
    badge: '🌱 Level I',
    minXp: 0,
    maxXp: 50,
    color: 'from-slate-500 to-zinc-600',
  };
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
