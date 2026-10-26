import React from 'react';
import { UserCheck, MapPin, Phone, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Therapist } from '../types';

interface TherapistSectionProps {
  therapists: Therapist[];
  onSelectTherapistToBook: (therapistId: string) => void;
}

export const TherapistSection: React.FC<TherapistSectionProps> = ({
  therapists,
  onSelectTherapistToBook
}) => {
  return (
    <section id="terapis-section" className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Praktisi Syar'i Terpercaya
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">
            Terapis Utama & Pembina Ruqyah Kuningan
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            Pelayanan terapi dibimbing langsung oleh <strong>Ustadz Imam Syahrobani, M.Pd</strong> (Founder Ruqyah Kuningan & Ketua QHI Kab. Kuningan, 15 Tahun Praktisi Ruqyah) serta tim terapis pendamping muslimah. Jadwal terapi fleksibel berdasarkan kesepakatan bersama.
          </p>
        </div>

        {/* Featured Therapist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {therapists.map((th) => (
            <div
              key={th.id}
              className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all shadow-xs ${
                th.id === 'th-imam'
                  ? 'bg-emerald-950 text-white border-emerald-900'
                  : 'bg-stone-50 text-stone-900 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-sm shadow-sm shrink-0 ${
                    th.id === 'th-imam'
                      ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300'
                      : 'bg-emerald-800 text-amber-300'
                  }`}>
                    {th.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${th.id === 'th-imam' ? 'text-white' : 'text-stone-900'}`}>
                      {th.name}
                    </h3>
                    <p className={`text-xs font-semibold ${th.id === 'th-imam' ? 'text-amber-300' : 'text-emerald-800'}`}>
                      {th.title}
                    </p>
                  </div>
                </div>

                <div className={`space-y-2 text-xs mb-4 ${th.id === 'th-imam' ? 'text-stone-200' : 'text-stone-600'}`}>
                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${th.id === 'th-imam' ? 'text-emerald-400' : 'text-emerald-700'}`} />
                    <span>{th.education}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <HeartHandshake className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${th.id === 'th-imam' ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className="font-semibold">{th.experience}</span>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed mb-4 ${th.id === 'th-imam' ? 'text-stone-300' : 'text-stone-700'}`}>
                  {th.bio}
                </p>
              </div>

              <div className={`pt-4 border-t ${th.id === 'th-imam' ? 'border-emerald-900' : 'border-stone-200'}`}>
                <div className={`text-[11px] mb-2 ${th.id === 'th-imam' ? 'text-stone-400' : 'text-stone-500'}`}>
                  Ketentuan Jadwal: <span className={`font-medium ${th.id === 'th-imam' ? 'text-amber-300' : 'text-stone-800'}`}>Berdasarkan Kesepakatan (Durasi 60 Menit)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTherapistToBook(th.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    th.id === 'th-imam'
                      ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-sm'
                      : 'bg-white border border-stone-300 hover:border-emerald-700 hover:text-emerald-900 text-stone-800'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Pilih Terapis & Ajukan Jadwal</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Location & Clinic Profile */}
        <div className="p-5 sm:p-8 rounded-2xl bg-stone-900 text-white grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-5 rounded-xl overflow-hidden w-full">
            <img
              src="/src/assets/images/ruqyah_consultation_1792986570974.jpg"
              alt="Konsultasi ramah dengan terapis ruqyah kuningan"
              referrerPolicy="no-referrer"
              className="w-full h-56 sm:h-72 object-cover rounded-xl"
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Lokasi Klinik & Jangkauan Layanan Kuningan</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white [text-wrap:balance]">
              Ruang Terapi Privat & Layanan Homecare Se-Kabupaten Kuningan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60 break-words">
                <span className="text-amber-300 font-semibold block mb-1">Alamat Klinik:</span>
                Rumah Quran Kuningan, Jl Cemara C1-C2 Perumahan Alam Asri Desa Gerba Kec Kramatmulya - Kuningan.
              </div>
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 break-words">
                <span className="text-amber-300 font-semibold block mb-1">Jam Operasional:</span>
                Setiap Hari: 08:00 - 21:00 WIB (Berdasarkan kesepakatan jadwal).
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/6283869262287?text=Assalamu'alaikum%20Ustadz%20Imam%20Syahrobani,%20saya%20ingin%20konsultasi%20jadwal%20terapi%20ruqyah"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Konsultasi WA Admin (0838-6926-2287)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
