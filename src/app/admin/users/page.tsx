import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { ShieldCheck, UserCheck, PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { role: 'asc' },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Manajemen Akun Terpadu</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Master Data Pengguna Sekolah</h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Kelola seluruh akun Pelajar, Guru Pembimbing, dan Administrator institusi dalam satu sistem basis data terpusat.
            </p>
          </div>
        </div>

        <div className="card-elite overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Daftar Pengguna ({users.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">NIS / NIP</th>
                  <th className="p-4">Kelas / Departemen</th>
                  <th className="p-4 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-[#8B0000] flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'student'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : u.role === 'teacher'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : u.role === 'admin'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{u.nisNip || '-'}</td>
                    <td className="p-4 text-slate-600">{u.className || u.department || '-'}</td>
                    <td className="p-4 text-right font-black text-[#8B0000]">
                      {u.role === 'student' ? `${u.xp} XP` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
