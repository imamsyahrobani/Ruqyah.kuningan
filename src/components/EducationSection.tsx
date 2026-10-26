import React from 'react';
import { Check, X, Shield } from 'lucide-react';

export const EducationSection: React.FC = () => {
  return (
    <section id="edukasi-section" className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Edukasi Tauhid & Syariat
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">
            Membedakan Ruqyah Syar'iyyah vs Praktik Perdukunan
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            Pastikan terapi yang Anda dan keluarga jalani murni berlandaskan tuntunan Rasulullah ﷺ dan fatwa para ulama Ahlussunnah, tanpa menyekutukan Allah.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ruqyah Syar'iyyah */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-emerald-300 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold text-base">
              <Shield className="w-5 h-5 text-emerald-700" />
              <span>Ruqyah Syar'iyyah (Sunnah Shahihah)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Menggunakan ayat-ayat suci Al-Qur'an dan doa-doa yang diajarkan oleh Nabi Muhammad ﷺ.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Bacaan jelas, terdengar jelas, dan tidak menggunakan komat-kamit atau mantra misterius.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Meyakini dengan tegas bahwa ruqyah hanyalah sebab, kesembuhan mutlak berasal dari Allah semata.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Pasien akhwat wajib didampingi mahram, menjaga aurat, tanpa sentuhan fisik non-mahram.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Mengajarkan pasien untuk bertaubat, buang jimat, dan mandiri beribadah mendekatkan diri pada Allah.</span>
              </li>
            </ul>
          </div>

          {/* Dukun / Klenik / Syirkiyyah */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-100/90 border border-stone-300 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-red-700 font-bold text-base">
              <X className="w-5 h-5 text-red-600" />
              <span>Praktik Dukun / Klenik / Syirkiyyah (Haram)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-600">
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Meminta syarat ganjil seperti ayam cemani, kain kafan, kembang 7 rupa, atau sesajen tertentu.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Memberikan bungkusan jimat, wafaq rajah angka Arab gundul, keris bertuah, atau sabuk kebal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Mengklaim tahu masa depan atau menuduh saudara/tetangga sebagai pengirim sihir (fitnah gaib).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Membaca mantra bisik-bisik tidak jelas yang disisipi nama-nama bangsa jin dan iblis.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Meminta pasien mandi kembang tengah malam atau menyuruh melakukan ritual bertentangan syariat.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
