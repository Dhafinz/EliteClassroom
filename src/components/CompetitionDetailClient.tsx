'use client';

import React, { useState } from 'react';
import { requestMentorship, createTeam, joinTeam } from '@/app/actions/competitions';
import { sendCompetitionMessage } from '@/app/actions/chat';
import { useAuth } from '@/context/AuthContext';
import {
  Trophy,
  Clock,
  ExternalLink,
  BookOpen,
  Users,
  User,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PlusCircle,
  MessageSquare,
  Send,
} from 'lucide-react';

interface CompetitionDetailClientProps {
  competition: any;
  teachers: any[];
}

export default function CompetitionDetailClient({
  competition,
  teachers,
}: CompetitionDetailClientProps) {
  const { user } = useAuth();
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Chat message state
  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>(competition.messages || []);
  const [sendingChat, setSendingChat] = useState(false);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const isTeam = competition.type === 'team';
  const deadlineDate = new Date(competition.deadline).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleRequestMentor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    const teacherId = Number(formData.get('teacherId'));
    const field = String(formData.get('field') || competition.categoryName);
    const notes = String(formData.get('notes') || '');

    const res = await requestMentorship(teacherId, user.id, field, notes);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setShowMentorModal(false);
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoading(false);
  };

  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    const teamName = String(formData.get('teamName') || '').trim();

    const res = await createTeam(competition.id, user.id, teamName);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setShowTeamModal(false);
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoading(false);
  };

  const handleJoinTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    const code = String(formData.get('inviteCode') || '').trim();

    const res = await joinTeam(code, user.id);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setShowJoinModal(false);
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !chatText.trim()) return;
    setSendingChat(true);

    const res = await sendCompetitionMessage(competition.id, user.id, chatText);
    if (res.success && res.data) {
      setChatMessages((prev) => [...prev, res.data]);
      setChatText('');
    }
    setSendingChat(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Hero Banner with Poster */}
      <div className="card-elite overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full bg-slate-900">
          <img
            src={competition.poster || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
            alt={competition.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          {/* TOP LEFT: TULISAN "TIM" ATAU "INDIVIDU" */}
          <div className="absolute top-4 left-4">
            {isTeam ? (
              <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#991B1B] to-[#F43F5E] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-white/20">
                <Users className="w-4 h-4" />
                TIM
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-white/20">
                <User className="w-4 h-4" />
                INDIVIDU
              </span>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-600 font-extrabold text-xs uppercase tracking-wider">
                Tingkat {competition.level}
              </span>
              <span className="px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-white font-bold text-xs">
                {competition.categoryName}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black leading-tight">
              {competition.title}
            </h1>

            <p className="text-xs sm:text-sm text-rose-200">
              Diselenggarakan oleh: <strong>{competition.organizer}</strong>
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-rose-600" />
            <span>
              Batas Akhir Pendaftaran: <strong className="text-slate-800 text-sm">{deadlineDate}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowMentorModal(true)}
              className="btn-primary-crimson text-xs py-2 px-4 shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Minta Guru Pembimbing</span>
            </button>

            {isTeam && (
              <>
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="btn-accent-rose text-xs py-2 px-4 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Bentuk Tim Baru</span>
                </button>

                <button
                  onClick={() => setShowJoinModal(true)}
                  className="btn-secondary-white text-xs py-2 px-4"
                >
                  <UserPlus className="w-4 h-4 text-slate-600" />
                  <span>Gabung Tim (Kode)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Kebutuhan Lomba Highlight Box */}
      <div className="card-elite p-5 bg-gradient-to-r from-rose-50/70 via-white to-pink-50/70 border border-rose-200/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            {isTeam ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
              Kebutuhan & Kriteria Tim Lomba:
            </span>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">
              {competition.teamRequirement || (isTeam ? '3 Orang Anggota Tim' : '1 Peserta Individu')}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white text-rose-700 border border-rose-200 text-xs font-bold shadow-xs">
          {isTeam ? 'Bersifat Tim' : 'Bersifat Individu'}
        </span>
      </div>

      {/* Main Grid: Description & KOLOM CHAT PENCARIAN TIM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Description & Links */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-elite p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
              Deskripsi & Rincian Kompetisi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {competition.description}
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              {competition.linkRegistration && (
                <a
                  href={competition.linkRegistration}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary-crimson text-xs py-2 px-4 inline-flex items-center gap-1.5"
                >
                  <span>Link Registrasi Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {competition.guidebookLink && (
                <a
                  href={competition.guidebookLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary-white text-xs py-2 px-4 inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Unduh Buku Panduan</span>
                </a>
              )}
            </div>
          </div>

          {/* KOLOM CHAT DI SETIAP LOMBA (PENCARIAN TIM / ANGGOTA) */}
          <div className="card-elite p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#8B0000]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Forum Chat & Pencarian Rekan Tim Lomba
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kekurangan anggota atau belum punya tim? Infokan dan cari rekan di sini!
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                {chatMessages.length} Pesan
              </span>
            </div>

            {/* Chat Messages Stream */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {chatMessages.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl">
                  Belum ada pesan di forum lomba ini. Jadilah yang pertama mengajak rekan tim!
                </div>
              ) : (
                chatMessages.map((msg: any) => {
                  const isMe = user?.id === msg.userId;
                  const timeStr = new Date(msg.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl text-xs space-y-1 ${
                        isMe
                          ? 'bg-rose-50/90 border border-rose-200 ml-6 text-slate-800'
                          : 'bg-slate-50 border border-slate-200 mr-6 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#8B0000]">
                          {msg.user?.name || 'Siswa'} {isMe && '(Anda)'}
                        </span>
                        <span className="text-[10px] text-slate-400">{timeStr}</span>
                      </div>
                      <p className="leading-relaxed">{msg.message}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form Send Message */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Tulis pesan... Contoh: 'Tim kami butuh 1 UI/UX, ada yang berminat?'"
                className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
              />
              <button
                type="submit"
                disabled={sendingChat || !chatText.trim()}
                className="btn-accent-rose text-xs py-2 px-4 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right col: Existing Teams in Competition */}
        <div className="card-elite p-6 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Tim Terdaftar</span>
            <span className="text-xs text-rose-600 font-bold">{competition.teams?.length || 0} Tim</span>
          </h3>

          {competition.teams && competition.teams.length > 0 ? (
            <div className="space-y-2.5">
              {competition.teams.map((t: any) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <p className="font-bold text-slate-800">{t.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Kode Undangan: <span className="font-bold text-[#8B0000]">{t.inviteCode}</span>
                  </p>
                  {t.members && (
                    <p className="text-[10px] text-slate-400">
                      {t.members.length} Anggota Terdaftar
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Belum ada tim yang terdaftar. Ayo bentuk tim pertama!</p>
          )}
        </div>
      </div>

      {/* MODAL 1: REQUEST MENTOR */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-800">Ajukan Bimbingan Guru Pembimbing</h3>
            <p className="text-xs text-slate-500">
              Pilih guru pembimbing favorit yang relevan dengan bidang lomba ini.
            </p>

            <form onSubmit={handleRequestMentor} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pilih Guru Pembimbing</label>
                <select
                  name="teacherId"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department || 'Pendidik'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Fokus / Bidang Bimbingan</label>
                <input
                  name="field"
                  defaultValue={competition.categoryName}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Catatan / Rencana Karya</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Contoh: Kami berencana membuat aplikasi web Next.js untuk tema lomba ini..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMentorModal(false)}
                  className="btn-secondary-white text-xs py-2 px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-crimson text-xs py-2 px-4"
                >
                  {loading ? 'Mengirim...' : 'Kirim Permohonan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE TEAM */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-800">Bentuk Tim Lomba Baru</h3>
            <p className="text-xs text-slate-500">
              Sistem akan otomatis menghasilkan kode undangan unik untuk teman satu tim Anda.
            </p>

            <form onSubmit={handleCreateTeam} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Tim *</label>
                <input
                  name="teamName"
                  required
                  placeholder="Contoh: Alpha Cyber Tech"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="btn-secondary-white text-xs py-2 px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent-rose text-xs py-2 px-4"
                >
                  {loading ? 'Membuat...' : 'Bentuk Tim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: JOIN TEAM */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-800">Gabung Tim dengan Kode Undangan</h3>
            <p className="text-xs text-slate-500">
              Masukkan 6 digit kode undangan tim yang diberikan oleh ketua tim Anda.
            </p>

            <form onSubmit={handleJoinTeam} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kode Undangan Tim *</label>
                <input
                  name="inviteCode"
                  required
                  placeholder="Contoh: ELT-89X"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="btn-secondary-white text-xs py-2 px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-crimson text-xs py-2 px-4"
                >
                  {loading ? 'Memproses...' : 'Gabung Tim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
