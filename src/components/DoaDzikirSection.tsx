import React, { useState, useEffect } from 'react';
import { Play, Pause, BookOpen, Volume2, Sparkles, CheckCircle2, Copy } from 'lucide-react';
import { DoaItem } from '../types';

export const DoaDzikirSection: React.FC = () => {
  const [doaList, setDoaList] = useState<DoaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDoaId, setSelectedDoaId] = useState<string>('doa-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/doa-dzikir')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setDoaList(data.data);
          if (data.data.length > 0) {
            setSelectedDoaId(data.data[0].id);
          }
        }
      })
      .catch((err) => console.error('Failed to load doa:', err))
      .finally(() => setLoading(false));
  }, []);

  const currentDoa = doaList.find((d) => d.id === selectedDoaId) || doaList[0];

  const togglePlayAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="doa-section" className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Panduan Mandiri Qur'ani
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">
            Ayat-Ayat Ruqyah Syar'iyyah & Dzikir Benteng Diri
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            Kumpulan bacaan Al-Qur'an dan doa Nabawiyyah shahih yang dapat diamalkan setiap hari untuk perlindungan diri, keluarga, dan kediaman dari segala marabahaya.
          </p>
        </div>

        {/* 2-Column Split: Selector & Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: List of Doa / Ayat */}
          <div className="lg:col-span-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 px-1">
              Daftar Ayat & Doa Perlindungan:
            </h3>
            {loading ? (
              <div className="p-6 text-center text-xs text-stone-500">Memuat bacaan...</div>
            ) : (
              doaList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedDoaId(item.id);
                    setIsPlaying(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedDoaId === item.id
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-700'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{item.title}</span>
                    <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                    {item.benefit}
                  </p>
                </div>
              ))
            )}

            {/* Quick Tutorial Card on Ruqyah Mandiri */}
            <div className="mt-6 p-4 rounded-xl bg-stone-900 text-stone-200 text-xs space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Tata Cara Ruqyah Mandiri:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-stone-300 text-[11px] leading-relaxed">
                <li>Berwudhu dan bersihkan tempat dari gambar bernyawa/patung.</li>
                <li>Membaca ta'awudz dan bismillah dengan khusyuk.</li>
                <li>Rapatkan kedua telapak tangan di depan mulut, baca Al-Fatihah, Ayat Kursi, dan 3 Qul.</li>
                <li>Tiupkan hembusan nafas lembut ke telapak tangan sebanyak 3 kali.</li>
                <li>Usapkan ke wajah, kepala, dada, dan seluruh anggota tubuh yang terjangkau.</li>
              </ol>
            </div>
          </div>

          {/* Right Column: Full Display Card */}
          <div className="lg:col-span-8 w-full min-w-0">
            {currentDoa && (
              <div className="p-4 sm:p-6 md:p-8 rounded-2xl border border-stone-200 bg-stone-50/60 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <span className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">
                      Ayat / Doa Terpilih
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                      {currentDoa.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlayAudio}
                      className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 text-amber-300" />
                          <span>Jeda Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-amber-300" />
                          <span>Dengarkan Murottal</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => copyText(`${currentDoa.arabic}\n\n${currentDoa.translation}`, currentDoa.id)}
                      className="p-2 rounded-xl border border-stone-200 hover:bg-white text-stone-600 transition-colors"
                      title="Salin Teks Doa"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isPlaying && (
                  <div className="p-3 bg-emerald-100/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-800 animate-pulse shrink-0" />
                      <span className="truncate">Memutar lantunan tilawah syar’iyyah dengan tartil khusyuk...</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 tabular-nums shrink-0 ml-2">00:48 / 02:15</span>
                  </div>
                )}

                {/* Arabic Script */}
                <div className="py-4 text-right">
                  <p
                    dir="rtl"
                    className="font-serif text-xl sm:text-3xl lg:text-4xl leading-loose sm:leading-loose text-stone-900 font-normal select-text break-words"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    {currentDoa.arabic}
                  </p>
                </div>

                {/* Latin Transliteration */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Transliterasi Latin:
                  </span>
                  <p className="italic text-stone-700">{currentDoa.latin}</p>
                </div>

                {/* Indonesian Translation */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Artinya:
                  </span>
                  <p>{currentDoa.translation}</p>
                </div>

                {/* Fadhilah & Anjuran Mengamalkan */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                  <span className="font-bold flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    Khasiat & Kaidah Pengamalan:
                  </span>
                  <p className="text-stone-700 leading-relaxed">{currentDoa.benefit}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
