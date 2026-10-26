import React from 'react';
import { MapPin, Phone, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTracking,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300 font-bold text-xs">
                RK
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Ruqyah Kuningan
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Pusat pelayanan terapi Ruqyah Syar'iyyah Qur'aniyyah dan Thibbun Nabawi bersanad resmi di Kabupaten Kuningan, Jawa Barat. Membina aqidah, membersihkan gangguan rohani dan jasmani tanpa syirik.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              Menu Layanan
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Layanan Terapi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('jadwal')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Pendaftaran Jadwal Pasien
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tes')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Tes Skrining Gejala Mandiri
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doa')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Ayat & Doa Ruqyah Syar'i
                </button>
              </li>
            </ul>
          </div>

          {/* Pasien & Portal */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              Akses Pasien & Terapis
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Cek Status Tiket / Booking
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Portal Manajemen Jadwal Pasien
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/6283869262287?text=Assalamu'alaikum%20Admin%20Ruqyah%20Kuningan,%20saya%20ingin%20konsultasi%20jadwal%20terapi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  WhatsApp Admin (0838-6926-2287)
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="space-y-2 text-stone-400">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              Klinik & Kontak
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Rumah Quran Kuningan, Jl Cemara C1-C2 Perumahan Alam Asri Desa Gerba Kec Kramatmulya - Kuningan</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>WA Admin: 0838-6926-2287</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Setiap Hari: 08:00 - 21:00 WIB (Sesuai Kesepakatan)</span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Ruqyah Kuningan. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-1">
            <span>Terapi Syar'i Qur'ani & Thibbun Nabawi untuk Umat</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
