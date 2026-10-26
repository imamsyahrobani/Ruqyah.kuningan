import React from 'react';
import { CalendarCheck, ShieldCheck, ClipboardCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdmin,
  onOpenTracking
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveTab('beranda')}
            className="flex items-center gap-2 text-left shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-900 flex items-center justify-center text-amber-300 font-bold text-sm shadow-sm shrink-0">
              RK
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-emerald-950 whitespace-nowrap">
              Ruqyah Kuningan
            </span>
          </button>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('beranda')}
              className={`hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'beranda' ? 'border-emerald-800 text-emerald-950 font-semibold' : 'border-transparent'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => setActiveTab('layanan')}
              className={`hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'layanan' ? 'border-emerald-800 text-emerald-950 font-semibold' : 'border-transparent'
              }`}
            >
              Layanan Terapi
            </button>
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'jadwal' ? 'border-emerald-800 text-emerald-950 font-semibold' : 'border-transparent'
              }`}
            >
              Penjadwalan Pasien
            </button>
            <button
              onClick={() => setActiveTab('tes')}
              className={`hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'tes' ? 'border-emerald-800 text-emerald-950 font-semibold' : 'border-transparent'
              }`}
            >
              Tes Mandiri Gejala
            </button>
            <button
              onClick={() => setActiveTab('doa')}
              className={`hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'doa' ? 'border-emerald-800 text-emerald-950 font-semibold' : 'border-transparent'
              }`}
            >
              Ayat & Doa Ruqyah
            </button>
          </nav>

          {/* Zone 3: 1 primary action + subtle utility controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={onOpenTracking}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-stone-700 hover:text-emerald-900 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Cek Status Tiket / Booking Pasien"
            >
              <ClipboardCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" />
              <span className="hidden sm:inline">Cek Status Tiket</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-stone-700 hover:text-emerald-900 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Portal Terapis & Jadwal"
            >
              <ShieldCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-stone-500 shrink-0" />
              <span className="hidden md:inline">Panel Terapis</span>
            </button>

            <button
              onClick={() => setActiveTab('jadwal')}
              className="px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 active:scale-[0.98]"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Daftar Jadwal</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
