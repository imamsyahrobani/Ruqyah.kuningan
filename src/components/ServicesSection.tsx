import React from 'react';
import { Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceToBook: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceToBook
}) => {
  return (
    <section id="layanan-section" className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Pilihan Terapi Syifa
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">
            Layanan Terapi Ruqyah Syar'iyyah Kuningan
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            Kami menyediakan beragam pilihan sesi terapi ruqyah syar'iyyah intensif 60 menit, mulai dari konsultasi privat di klinik, bimbingan mandiri, hingga kunjungan langsung ke rumah dan tempat usaha se-Kabupaten Kuningan.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between hover:border-emerald-600 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    {srv.target}
                  </span>
                  <span className="text-xs font-medium text-stone-500 flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {srv.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-2 leading-snug">
                  {srv.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {srv.shortDesc}
                </p>

                <div className="space-y-1.5 mb-5 pt-3 border-t border-stone-200">
                  <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Fasilitas & Penanganan:
                  </div>
                  {srv.includes.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-stone-500">Infaq Layanan:</span>
                  <span className="font-semibold text-emerald-950">{srv.infak}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectServiceToBook(srv.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Pilih & Jadwalkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
