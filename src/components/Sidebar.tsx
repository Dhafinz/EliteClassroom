'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
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
  LogOut,
  FileText,
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
  const { user, logout } = useAuth();
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
    { label: 'Studio Materi & Dokumen', href: '/teacher/studio', icon: Video, badge: 'YouTube/Doc' },
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
    <aside className="fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-40 hidden md:flex flex-col justify-between shadow-xs">
      {/* Top: Brand Header */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#991B1B] via-[#8B0000] to-[#E11D48] flex items-center justify-center text-white shadow-md shadow-rose-900/20 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="truncate">
            <span className="font-black text-sm tracking-tight bg-gradient-to-r from-[#8B0000] to-[#E11D48] bg-clip-text text-transparent block">
              ELITE CLASSROOM
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block truncate">
              {role === 'student'
                ? 'Portal Pelajar'
                : role === 'teacher'
                ? 'Portal Guru Mentor'
                : role === 'admin'
                ? 'Portal Administrator'
                : 'Portal Developer'}
            </span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
          <p className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
            Menu Navigasi
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
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : link.highlight ? 'text-rose-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ${
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
        </div>
      </div>

      {/* Bottom: User Card & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B0000] to-[#F43F5E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Keluar / Ganti Akun"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full btn-primary-crimson text-xs py-2 block text-center"
          >
            Masuk ke Akun
          </Link>
        )}
      </div>
    </aside>
  );
}
