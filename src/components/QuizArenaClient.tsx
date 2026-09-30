'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { submitQuizAttempt } from '@/app/actions/learning';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctKey: string;
  explanation: string | null;
}

interface QuizArenaClientProps {
  quiz: {
    id: number;
    title: string;
    description: string;
    timeLimit: number;
    xpReward: number;
    questions: Question[];
  };
}

export default function QuizArenaClient({ quiz }: QuizArenaClientProps) {
  const { user, refreshUserData } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
    xpEarned: number;
    message: string;
  } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: number, key: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
  };

  const handleSubmit = async () => {
    if (!user || isSubmitted) return;
    setLoading(true);

    const res = await submitQuizAttempt(user.id, quiz.id, answers);

    if (res.success && res.score !== undefined) {
      setIsSubmitted(true);
      setResult({
        score: res.score,
        correctCount: res.correctCount || 0,
        totalQuestions: res.totalQuestions || quiz.questions.length,
        xpEarned: res.xpEarned || 0,
        message: res.message || 'Kuis selesai!',
      });

      if (res.score >= 70) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F43F5E', '#10B981', '#F59E0B'],
        });
      }

      await refreshUserData();
    }
    setLoading(false);
  };

  const currentQ = quiz.questions[currentIdx];

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Timer */}
      <div className="card-elite p-4 sm:p-5 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Arena Kuis Interaktif
          </span>
          <h1 className="text-base sm:text-lg font-black text-slate-800">{quiz.title}</h1>
        </div>

        {!isSubmitted && (
          <div
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm shadow-xs ${
              timeLeft < 180
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-rose-500" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* RESULT VIEW AFTER SUBMISSION */}
      {isSubmitted && result && (
        <div className="card-elite p-6 sm:p-8 space-y-6 text-center">
          <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-[#8B0000] to-[#F43F5E] text-white shadow-lg shadow-rose-950/20">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Hasil Evaluasi Kuis Anda
            </h2>
            <p className="text-sm font-semibold text-slate-600">{result.message}</p>
          </div>

          {/* Score Counter */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xl font-black text-slate-800">{result.score}%</span>
              <p className="text-[11px] text-slate-500">Skor Nilai</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xl font-black text-emerald-600">
                {result.correctCount}/{result.totalQuestions}
              </span>
              <p className="text-[11px] text-slate-500">Jawaban Benar</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <span className="text-2xl font-black text-rose-700">+{result.xpEarned} XP</span>
              <p className="text-[11px] text-rose-600 font-semibold">Reward XP</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link href="/student/quiz" className="btn-secondary-white text-xs py-2 px-4">
              <RotateCcw className="w-4 h-4" />
              <span>Daftar Kuis Lainnya</span>
            </Link>
            <Link href="/" className="btn-primary-crimson text-xs py-2 px-5">
              <span>Kembali ke Beranda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* QUESTION ARENA (ACTIVE OR REVIEW) */}
      {currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question & Options Area */}
          <div className="lg:col-span-3 card-elite p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                Soal Nomor <strong className="text-rose-700 text-sm">#{currentIdx + 1}</strong> dari{' '}
                {quiz.questions.length}
              </span>
              {answers[currentQ.id] ? (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Jawaban Dipilih
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-400">Belum dijawab</span>
              )}
            </div>

            <p className="text-base font-bold text-slate-800 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Options A-D */}
            <div className="space-y-3">
              {[
                { key: 'A', text: currentQ.optionA },
                { key: 'B', text: currentQ.optionB },
                { key: 'C', text: currentQ.optionC },
                { key: 'D', text: currentQ.optionD },
              ].map((opt) => {
                const isSelected = answers[currentQ.id] === opt.key;
                const isCorrect = isSubmitted && currentQ.correctKey === opt.key;
                const isWrongSelected = isSubmitted && isSelected && !isCorrect;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3.5 ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : isWrongSelected
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                        : isSelected
                        ? 'bg-rose-50/80 border-rose-400 text-rose-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isWrongSelected
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-[#8B0000] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="flex-1 leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Review */}
            {isSubmitted && currentQ.explanation && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-[#8B0000] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pembahasan Solusi (Kunci: {currentQ.correctKey})
                </span>
                <p className="text-slate-600 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="btn-secondary-white text-xs disabled:opacity-40"
              >
                ← Sebelumnya
              </button>

              {currentIdx < quiz.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((prev) => prev + 1)}
                  className="btn-accent-rose text-xs"
                >
                  Selanjutnya →
                </button>
              ) : (
                !isSubmitted && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary-crimson text-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{loading ? 'Mengoreksi...' : 'Kumpulkan & Selesai'}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div className="card-elite p-5 space-y-4 h-fit">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Navigasi Soal
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {quiz.questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg font-bold text-xs transition-all ${
                      isCurrent
                        ? 'ring-2 ring-[#8B0000] bg-[#8B0000] text-white shadow-xs'
                        : isAnswered
                        ? 'bg-rose-100 text-rose-900 border border-rose-300 font-extrabold'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300"></span>
                <span>Sudah dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-50 border border-slate-200"></span>
                <span>Belum dijawab</span>
              </div>
            </div>

            {!isSubmitted && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full btn-primary-crimson text-xs py-2 mt-4"
              >
                {loading ? 'Mengoreksi...' : 'Kumpulkan Kuis'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
