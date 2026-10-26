import React from 'react';
import { Calendar, CheckCircle2, ChevronRight, MapPin, HeartHandshake, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeroSectionProps {
  onStartBooking: () => void;
  onStartQuiz: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBooking,
  onStartQuiz,
  onExploreServices
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background Image with Measured Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/ruqyah_hero_kuningan_1792986570615.jpg"
          alt="Suasana tenang ruang terapi ruqyah syari'iyyah di Kuningan Jawa Barat"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          {/* Metadata line without pills */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-amber-300 font-medium tracking-wide mb-4">
            <span className="flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Kabupaten Kuningan, Jawa Barat
            </span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="shrink-0">Thibbun Nabawi & Syifa Qur'ani</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="shrink-0">Terapis Bersanad Resmi</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6 [text-wrap:balance]">
            Pusat Terapi Ruqyah Syar'iyyah & Penjadwalan Pasien Kuningan
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-stone-200 leading-relaxed mb-8 max-w-2xl">
            Dibimbing langsung oleh <strong>Ustadz Imam Syahrobani, M.Pd</strong> (Founder Ruqyah Kuningan & Ketua QHI Kab. Kuningan, 15 Tahun Praktisi Ruqyah). Sesi terapi berdurasi <strong>60 menit</strong> (klinik & homecare 32 kecamatan) dengan jadwal fleksibel berdasarkan kesepakatan bersama. Murni Qur'ani tanpa syirik atau jimat.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 w-full">
            <button
              onClick={onStartBooking}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Jadwalkan Terapi Pasien</span>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>

            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-100 border border-stone-700 font-medium text-sm sm:text-base flex items-center justify-center gap-2 backdrop-blur-sm active:scale-[0.98] transition-all"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Tes Skrining Gejala Mandiri</span>
            </button>

            <button
              onClick={onExploreServices}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl text-stone-300 hover:text-white font-medium text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Pelajari Layanan</span>
            </button>
          </div>

          {/* Trust proof factors adjacent to hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-stone-800/80 text-xs sm:text-sm text-stone-300">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>100% Syar'i Tanpa Syirik / Jimat</span>
            </div>
            <div className="flex items-start gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Terapis Ikhwan & Akhwat Bersanad</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>32 Kecamatan di Kab. Kuningan</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Privasi Pasien Terjamin Aman</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
