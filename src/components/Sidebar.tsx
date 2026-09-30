'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Video,
  HelpCircle,
  Trophy,
  PlusCircle,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Activity,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface SidebarLink {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || 'student';

  const studentLinks: SidebarLink[] = [
    { label: 'Beranda Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Ruang Belajar (+3 XP)', href: '/student/learn', icon: Video, badge: '✨ +3 XP' },
    { label: 'Kuis Interaktif', href: '/student/quiz', icon: HelpCircle },
    { label: 'Eksplorasi Lomba', href: '/student/competitions', icon: Trophy },
    { label: 'Usulkan Lomba Baru', href: '/student/competitions/submit', icon: PlusCircle, highlight: true },
    { label: 'Tim & Bimbingan Saya', href: '/student/my-competitions', icon: Users },
    { label: 'Leaderboard Prestasi', href: '/student/leaderboard', icon: Award },
  ];

  const teacherLinks: SidebarLink[] = [
    { label: 'Beranda Guru', href: '/', icon: LayoutDashboard },
    { label: 'Studio Materi YouTube', href: '/teacher/studio', icon: Video, badge: 'HD Auto' },
    { label: 'Mentorship Hub', href: '/teacher/mentorship', icon: Users, badge: 'Inbox' },
    { label: 'Rekap Nilai & XP Murid', href: '/teacher/students', icon: BookOpen },
    { label: 'Katalog Lomba Sekolah', href: '/student/competitions', icon: Trophy },
  ];

  const adminLinks: SidebarLink[] = [
    { label: 'Overview Admin', href: '/', icon: LayoutDashboard },
    { label: 'Verifikasi Usulan Lomba', href: '/admin/competitions/verify', icon: FileCheck, badge: 'Review' },
    { label: 'Manajemen Akun User', href: '/admin/users', icon: ShieldCheck },
    { label: 'Rekap Prestasi Juara', href: '/admin/reports', icon: Award },
  ];

  const devLinks: SidebarLink[] = [
    { label: 'Dashboard Dev', href: '/', icon: LayoutDashboard },
    { label: 'System Health & SQLite', href: '/dev/health', icon: Activity, badge: 'Live' },
    { label: 'Audit Activity Logs', href: '/dev/logs', icon: CheckCircle2 },
  ];

  const activeLinks =
    role === 'teacher'
      ? teacherLinks
      : role === 'admin'
      ? adminLinks
      : role === 'developer'
      ? devLinks
      : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-6">
        {/* Role Badge Indicator */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-rose-50 to-slate-50 border border-rose-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Portal Aktif
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-bold text-[#8B0000] capitalize flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              {role === 'student'
                ? 'Portal Pelajar'
                : role === 'teacher'
                ? 'Portal Guru / Mentor'
                : role === 'admin'
                ? 'Portal Administrator'
                : 'Portal Developer'}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
              v1.0
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1">
          <p className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
            Menu Utama
          </p>
          {activeLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#991B1B] to-[#8B0000] text-white shadow-md shadow-rose-950/20'
                    : link.highlight
                    ? 'bg-rose-50/80 text-[#991B1B] hover:bg-rose-100 border border-rose-200/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : link.highlight ? 'text-rose-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Motivational Card for Students */}
        {role === 'student' && (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#8B0000] to-[#E11D48] text-white shadow-md shadow-rose-900/15">
            <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ayo Raih Juara!</span>
            </div>
            <p className="text-[11px] text-rose-100 leading-relaxed mb-3">
              Tonton video belajar (+3 XP), temukan lomba baru, dan minta bimbingan guru.
            </p>
            <Link
              href="/student/competitions/submit"
              className="block text-center py-1.5 px-3 bg-white text-[#8B0000] font-bold text-[11px] rounded-lg hover:bg-rose-50 transition-colors shadow-xs"
            >
              + Usulkan Lomba Baru
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
