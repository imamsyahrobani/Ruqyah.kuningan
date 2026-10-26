import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckSquare,
  Square,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { QuizQuestion, QuizResult } from '../types';

interface QuizSectionProps {
  onScheduleWithQuizResult: (symptoms: string) => void;
  onOpenDoa: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  onScheduleWithQuizResult,
  onOpenDoa
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    fetch('/api/quiz-questions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setQuestions(data.data);
        }
      })
      .catch((err) => console.error('Error fetching quiz:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleQuestion = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/quiz-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedIds })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      }
    } catch (err) {
      console.error('Quiz analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setResult(null);
  };

  const handleTransferToBooking = () => {
    if (!result) return;
    const answeredText = questions
      .filter((q) => selectedIds.includes(q.id))
      .map((q) => q.question)
      .join('; ');
    const summary = `Hasil Skrining: ${result.severity} (Skor: ${result.score}). Gejala yang dialami: ${answeredText || 'Keluhan umum'}`;
    onScheduleWithQuizResult(summary);
  };

  return (
    <section id="tes-section" className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Skrining Mandiri Syar'i
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">
            Tes Indikasi Gejala Gangguan Psikis & Non-Medis
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            Identifikasi awal apakah keluhan yang Anda rasakan mengarah pada kelelahan fisik medis, was-was, pengaruh ‘ain, atau gangguan jin menurut kaidah Ruqyah Syar'iyyah.
          </p>
        </div>

        {/* Questionnaire Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 md:p-8">
          {loading ? (
            <div className="p-8 text-center text-sm text-stone-500">
              Memuat daftar pertanyaan skrining...
            </div>
          ) : !result ? (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-700">
                  Pilih semua poin yang sering Anda rasakan (minimal 1 atau lebih):
                </span>
                <span className="text-xs text-stone-500 tabular-nums shrink-0">
                  Terpilih: {selectedIds.length} dari {questions.length}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {questions.map((q) => {
                  const isChecked = selectedIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleQuestion(q.id)}
                      className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-emerald-800 focus:outline-none shrink-0"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-800" />
                        ) : (
                          <Square className="w-5 h-5 text-stone-400" />
                        )}
                      </button>
                      <div className="flex-1 text-xs sm:text-sm text-stone-800 leading-snug">
                        {q.question}
                        <span className="block text-[11px] text-stone-400 mt-1">
                          Kategori: {q.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={selectedIds.length === 0}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium disabled:opacity-40"
                >
                  Reset Pilihan
                </button>

                <button
                  type="button"
                  disabled={analyzing}
                  onClick={handleAnalyze}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {analyzing ? (
                    <span>Menganalisis Jawaban...</span>
                  ) : (
                    <>
                      <span>Lihat Hasil Analisis Syar'i</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* RESULT STATE */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs text-stone-500 block">Hasil Skrining Anda:</span>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                    Tingkat Indikasi: <span className="text-emerald-900">{result.severity}</span>
                  </h3>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                  title="Ulangi Tes"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Penjelasan & Nasihat Syar'iyyah:
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {result.advice}
                </p>
              </div>

              {/* Action Recommendation */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Langkah Tindak Lanjut yang Dianjurkan:</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    {result.needPersonalTherapy
                      ? 'Dianjurkan mendaftar jadwal terapi ruqyah langsung atau homecare bersama terapis kami.'
                      : 'Cukup lakukan ruqyah mandiri dengan membaca ayat-ayat perlindungan dan dzikir.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {result.needPersonalTherapy ? (
                    <button
                      onClick={handleTransferToBooking}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
                    >
                      <span>Jadwalkan Terapi Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  ) : (
                    <button
                      onClick={onOpenDoa}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                      <span>Buka Ayat Ruqyah Mandiri</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
