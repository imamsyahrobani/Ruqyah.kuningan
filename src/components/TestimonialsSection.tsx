import React, { useState, useEffect } from 'react';
import {
  Quote,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Heart,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  onScheduleService?: (serviceId: string) => void;
  onOpenBookingGeneral?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onScheduleService,
  onOpenBookingGeneral
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setTestimonials(data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load testimonials:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Kisah' },
    { id: 'medis_fisik', label: 'Keluhan Fisik / Medis' },
    { id: 'psikis_waswas', label: 'Was-was & Psikis' },
    { id: 'homecare', label: 'Homecare & Rumah' },
    { id: 'usaha', label: 'Tempat Usaha' }
  ];

  const filteredTestimonials = testimonials.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const getServiceIdFromName = (serviceType: string): string => {
    if (serviceType.includes('Homecare')) return 'srv-ruqyah-homecare';
    if (serviceType.includes('Usaha')) return 'srv-ruqyah-usaha';
    if (serviceType.includes('Mandiri')) return 'srv-ruqyah-mandiri';
    return 'srv-ruqyah-klinik';
  };

  return (
    <section id="testimoni-section" className="py-12 sm:py-16 lg:py-20 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            <span>Kisah Nyata Pasien & Jama'ah</span>
            <span aria-hidden="true">·</span>
            <span>Kabupaten Kuningan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">
            Pengalaman & Ikhtiar Kesembuhan Pasien Ruqyah Syar'iyyah
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Kisah nyata para pasien dari berbagai kecamatan di Kabupaten Kuningan yang telah berikhtiar melalui ruqyah syar'iyyah dan thibbun nabawi. Kesembuhan mutlak milik Allah Ta'ala.
          </p>
        </div>

        {/* Quantitative Proof Strip (Claim-to-proof adjacency) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tabular-nums">
              1.200+
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              Sesi Pasien Terjadwal
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tabular-nums">
              32
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              Kecamatan se-Kuningan
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tabular-nums">
              100%
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              Bebas Syirik & Jimat
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tabular-nums">
              4.9 / 5.0
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              Indeks Kepuasan Terapi
            </div>
          </div>
        </div>

        {/* Filter Controls (Segmented Tabs with functional click handlers) */}
        <div className="w-full max-w-full overflow-x-auto pb-2 mb-8 scrollbar-none">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 p-1 bg-stone-200/80 rounded-xl min-w-max mx-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="p-12 text-center text-sm text-stone-500 bg-white rounded-2xl border border-stone-200">
            Memuat kisah dan pengalaman pasien...
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-12 text-center text-sm text-stone-500 bg-white rounded-2xl border border-stone-200">
            Tidak ada testimoni untuk kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item) => {
              const isExpanded = expandedId === item.id;
              const serviceId = getServiceIdFromName(item.serviceType);

              return (
                <article
                  key={item.id}
                  className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-700/60 transition-all"
                >
                  <div>
                    {/* Header: Patient Info without pills */}
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-stone-100">
                      <div>
                        <h3 className="text-base font-bold text-stone-900 leading-snug">
                          {item.name}
                        </h3>
                        <div className="text-xs text-stone-500 mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                          <span>{item.age} tahun</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.role}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-800 font-medium">{item.district}</span>
                        </div>
                      </div>

                      {item.verifiedBooking && (
                        <div
                          className="shrink-0 text-emerald-700 flex items-center gap-1 text-[11px] font-medium"
                          title="Pasien terverifikasi melalui sistem pendaftaran Ruqyah Kuningan"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span className="hidden sm:inline">Terverifikasi</span>
                        </div>
                      )}
                    </div>

                    {/* Service & Therapist Info */}
                    <div className="py-2.5 text-xs text-stone-600 border-b border-stone-100/70">
                      <div>
                        <span className="text-stone-400">Layanan: </span>
                        <span className="font-semibold text-stone-800">{item.serviceType}</span>
                      </div>
                      <div className="mt-0.5">
                        <span className="text-stone-400">Terapis: </span>
                        <span className="text-stone-700">{item.therapist}</span>
                      </div>
                    </div>

                    {/* Patient Quote */}
                    <div className="py-4 relative">
                      <Quote className="w-6 h-6 text-emerald-100 absolute -top-1 -left-1 -z-0 opacity-80" />
                      <p className="text-xs sm:text-sm text-stone-800 italic leading-relaxed relative z-10">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Before & After Journey Cards */}
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="font-bold text-stone-800 block text-[11px] uppercase tracking-wider mb-1">
                          Keluhan Awal:
                        </span>
                        <p className="text-stone-600 text-xs leading-relaxed">
                          {item.beforeCondition}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                        <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Perkembangan Pasca Terapi:</span>
                        </span>
                        <p className="text-stone-700 text-xs leading-relaxed">
                          {item.afterCondition}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-5 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-400 tabular-nums">
                      {item.date}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (onScheduleService) {
                          onScheduleService(serviceId);
                        } else if (onOpenBookingGeneral) {
                          onOpenBookingGeneral();
                        }
                      }}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1 transition-colors"
                    >
                      <span>Jadwalkan Seperti Ini</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom Call to Action Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Mengalami Keluhan Fisik atau Gangguan Ruhani Serupa?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Jangan ragu untuk berkonsultasi. Tim terapis Ruqyah Kuningan siap mendampingi Anda dan keluarga dengan metode syar'iyyah yang menenangkan.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBookingGeneral}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 active:scale-95"
          >
            <span>Daftar Jadwal Konsultasi</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
