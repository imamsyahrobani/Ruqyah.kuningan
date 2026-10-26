import React, { useState } from 'react';
import { Search, Calendar, User, Clock, AlertCircle, CheckCircle, MessageSquare, PhoneCall } from 'lucide-react';
import { Appointment } from '../types';

interface TrackingSectionProps {
  onGoToBooking: () => void;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({ onGoToBooking }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Appointment[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setResults(null);

    try {
      const res = await fetch(`/api/appointments/track?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Jadwal pasien tidak ditemukan.');
      }

      setResults(data.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mencari jadwal pasien.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dikonfirmasi':
        return (
          <span className="text-emerald-800 font-semibold text-xs flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Jadwal Dikonfirmasi (Siap Terapi)
          </span>
        );
      case 'selesai':
        return (
          <span className="text-stone-700 font-semibold text-xs flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-stone-500" />
            Sesi Terapi Selesai
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="text-red-700 font-semibold text-xs flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Jadwal Dibatalkan
          </span>
        );
      default:
        return (
          <span className="text-amber-700 font-semibold text-xs flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Validasi Terapis
          </span>
        );
    }
  };

  return (
    <section id="tracking-section" className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Pemeriksaan Jadwal Pasien
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">
            Cek Status & Rincian Jadwal Terapi
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
            Masukkan Kode Booking (contoh: RK-20261026-101) atau Nomor WhatsApp yang Anda gunakan saat mendaftar.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 w-full">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Kode Booking atau No. WhatsApp (contoh: 0812...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
            >
              {loading ? 'Mencari...' : 'Periksa Jadwal'}
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {errorMessage && (
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Jadwal Tidak Ditemukan</p>
              <p className="text-xs text-stone-600 mt-0.5">{errorMessage}</p>
              <button
                onClick={onGoToBooking}
                className="mt-2 text-xs text-emerald-800 hover:underline font-semibold"
              >
                Ingin mendaftarkan jadwal baru? Klik di sini &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Results List */}
        {results && results.length > 0 && (
          <div className="space-y-4 max-w-2xl mx-auto w-full">
            {results.map((booking) => (
              <div
                key={booking.id}
                className="p-4 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200 shadow-sm overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <div className="min-w-0">
                    <span className="text-[11px] text-stone-500 font-mono">Kode Booking:</span>
                    <span className="ml-2 font-mono font-bold text-sm text-emerald-950 truncate">
                      {booking.bookingCode}
                    </span>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-stone-500 block text-xs">Nama Pasien:</span>
                    <span className="font-semibold text-stone-900">{booking.patientName}</span>
                    <span className="text-stone-400 text-xs ml-1">({booking.gender})</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-xs">Layanan:</span>
                    <span className="font-semibold text-stone-900">{booking.serviceTitle}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-xs">Jadwal Terapi:</span>
                    <span className="font-semibold text-stone-900 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      {booking.date}
                      <Clock className="w-3.5 h-3.5 text-stone-400 ml-2" />
                      {booking.slot}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-xs">Terapis Bertugas:</span>
                    <span className="font-semibold text-stone-900">{booking.therapistName}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-500 block text-xs">Wilayah / Alamat:</span>
                    <span className="text-stone-800">{booking.address || booking.district}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-500 block text-xs">Keluhan Awal:</span>
                    <span className="text-stone-700 italic">"{booking.symptoms}"</span>
                  </div>
                </div>

                {booking.therapistNotes && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 mb-3">
                    <span className="font-bold block mb-1">Catatan Terapis / Petunjuk Khusus:</span>
                    <p className="text-stone-700">{booking.therapistNotes}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Didaftarkan: {new Date(booking.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                  <a
                    href={`https://wa.me/6283869262287?text=${encodeURIComponent(
                      `Assalamu'alaikum Admin Ruqyah Kuningan, saya ingin bertanya perihal jadwal booking saya (${booking.bookingCode}) atas nama ${booking.patientName}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Hubungi WA Admin</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
