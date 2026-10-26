import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
  Printer,
  Copy,
  Info
} from 'lucide-react';
import { Service, Therapist, SlotAvailability, Appointment } from '../types';

interface BookingSectionProps {
  services: Service[];
  therapists: Therapist[];
  districts: string[];
  initialServiceId?: string;
  initialSymptoms?: string;
  onBookingSuccess?: (appointment: Appointment) => void;
  onOpenTracking?: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  services,
  therapists,
  districts,
  initialServiceId,
  initialSymptoms,
  onBookingSuccess,
  onOpenTracking
}) => {
  // Step state (1: Layanan & Terapis, 2: Waktu & Tanggal, 3: Data Pasien & Keluhan, 4: Selesai / Bukti Tiket)
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || (services[0]?.id || 'srv-ruqyah-klinik'));
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>(therapists[0]?.id || 'th-imam');
  
  // Date defaults to tomorrow in YYYY-MM-DD
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowString());
  const [selectedSlot, setSelectedSlot] = useState<string>('Pagi (08:30 - 09:30 WIB) - Kesepakatan');
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [availableSlots, setAvailableSlots] = useState<SlotAvailability[]>([]);

  // Patient Info
  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gender, setGender] = useState<string>('Laki-laki');
  const [age, setAge] = useState<string>('');
  const [district, setDistrict] = useState<string>(districts[0] || 'Kecamatan Kuningan (Pusat Kota)');
  const [address, setAddress] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>(initialSymptoms || '');
  const [symptomCategory, setSymptomCategory] = useState<string>('Non-Medis & Psikis');

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Sync initial props
  useEffect(() => {
    if (initialServiceId) setSelectedServiceId(initialServiceId);
  }, [initialServiceId]);

  useEffect(() => {
    if (initialSymptoms) setSymptoms(initialSymptoms);
  }, [initialSymptoms]);

  // Fetch real-time slot availability whenever date or therapist changes
  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    fetch(`/api/schedule/slots?date=${selectedDate}&therapistId=${selectedTherapistId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.slots) {
          setAvailableSlots(data.slots);
          // Auto select first available slot if current selected is taken
          const currentSlotTaken = data.slots.some((s: SlotAvailability) => s.time === selectedSlot && !s.isAvailable);
          if (currentSlotTaken) {
            const firstAvailable = data.slots.find((s: SlotAvailability) => s.isAvailable);
            if (firstAvailable) setSelectedSlot(firstAvailable.time);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch slots:', err))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, selectedTherapistId]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedTherapist = therapists.find((t) => t.id === selectedTherapistId) || therapists[0];

  const handleNextStep = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!selectedServiceId || !selectedTherapistId) {
        setErrorMessage('Silakan pilih layanan terapi dan terapis yang bertugas.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedSlot) {
        setErrorMessage('Silakan tentukan tanggal dan jam konsultasi/terapi.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleSubmitBooking();
    }
  };

  const handleSubmitBooking = async () => {
    if (!patientName.trim()) {
      setErrorMessage('Nama lengkap pasien wajib diisi.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Nomor WhatsApp pasien wajib diisi untuk konfirmasi jadwal.');
      return;
    }
    if (!district) {
      setErrorMessage('Silakan pilih kecamatan/wilayah di Kuningan.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        patientName,
        phone,
        gender,
        age: age ? parseInt(age, 10) : undefined,
        district,
        address: address || district,
        serviceId: selectedServiceId,
        therapistId: selectedTherapistId,
        date: selectedDate,
        slot: selectedSlot,
        symptoms: symptoms || 'Permohonan ruqyah syar’iyyah & pembersihan rohani',
        symptomCategory
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Terjadi kesalahan saat memproses pendaftaran.');
      }

      setConfirmedBooking(resData.data);
      setStep(4);
      if (onBookingSuccess) {
        onBookingSuccess(resData.data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghubungi server.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyBookingCode = () => {
    if (confirmedBooking?.bookingCode) {
      navigator.clipboard.writeText(confirmedBooking.bookingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const createWhatsAppLink = () => {
    if (!confirmedBooking) return '#';
    const officialPhone = '6283869262287'; // WA Admin Ruqyah Kuningan
    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nSaya ingin konfirmasi pendaftaran jadwal Ruqyah Syar'iyyah di Kuningan:\n\n*Kode Booking:* ${confirmedBooking.bookingCode}\n*Nama Pasien:* ${confirmedBooking.patientName}\n*No. HP/WA:* ${confirmedBooking.phone}\n*Layanan:* ${confirmedBooking.serviceTitle}\n*Terapis:* ${confirmedBooking.therapistName}\n*Jadwal:* ${confirmedBooking.date} (${confirmedBooking.slot})\n*Wilayah:* ${confirmedBooking.district}\n*Keluhan:* ${confirmedBooking.symptoms}\n\n*Lokasi Klinik:* Rumah Quran Kuningan, Jl Cemara C1-C2 Perumahan Alam Asri Desa Gerba Kec Kramatmulya - Kuningan\n\nMohon konfirmasi kesepakatan jadwal dan petunjuk persiapan sebelum ruqyah. Syukron jazakumullah khair.`;
    return `https://wa.me/${officialPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="jadwal-section" className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            <span>Sistem Pendaftaran Pasien</span>
            <span aria-hidden="true">·</span>
            <span>Kuningan, Jawa Barat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight [text-wrap:balance]">
            Penjadwalan Terapi Ruqyah Syar'iyyah Pasien
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
            Atur waktu konsultasi dan terapi ruqyah dengan mudah. Jadwal real-time dan konfirmasi langsung ke nomor WhatsApp Anda.
          </p>
        </div>

        {/* Step Progress Indicator (Clean, non-pill) */}
        {step < 4 && (
          <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[11px] sm:text-xs md:text-sm font-medium">
              <div
                className={`py-2 px-1 border-b-2 transition-colors ${
                  step >= 1 ? 'border-emerald-800 text-emerald-950 font-bold' : 'border-stone-200 text-stone-400'
                }`}
              >
                <span className="sm:hidden">1. Layanan</span>
                <span className="hidden sm:inline">1. Layanan & Terapis</span>
              </div>
              <div
                className={`py-2 px-1 border-b-2 transition-colors ${
                  step >= 2 ? 'border-emerald-800 text-emerald-950 font-bold' : 'border-stone-200 text-stone-400'
                }`}
              >
                <span className="sm:hidden">2. Waktu</span>
                <span className="hidden sm:inline">2. Tanggal & Waktu</span>
              </div>
              <div
                className={`py-2 px-1 border-b-2 transition-colors ${
                  step >= 3 ? 'border-emerald-800 text-emerald-950 font-bold' : 'border-stone-200 text-stone-400'
                }`}
              >
                <span className="sm:hidden">3. Pasien</span>
                <span className="hidden sm:inline">3. Data Pasien</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Perhatian</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          {/* STEP 1: PILIH LAYANAN & TERAPIS */}
          {step === 1 && (
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-3">
                  Pilih Jenis Layanan Terapi Ruqyah
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedServiceId === srv.id
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                          {srv.title}
                        </h4>
                        <span className="text-[11px] font-medium text-emerald-800 shrink-0 tabular-nums">
                          {srv.duration}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 mb-2">
                        {srv.shortDesc}
                      </p>
                      <div className="text-[11px] text-stone-500 font-medium">
                        Infak: <span className="text-stone-700">{srv.infak}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-900 mb-2">
                  Terapis Ruqyah Syar'iyyah
                </label>
                <div className="p-4 rounded-xl border border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-950 text-amber-300 font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                      IS
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">
                        Ustadz Imam Syahrobani, M.Pd
                      </h4>
                      <p className="text-xs text-emerald-800 font-semibold">
                        Founder Ruqyah Kuningan & Ketua QHI Kab. Kuningan
                      </p>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        15 Tahun Praktisi Ruqyah Syar'iyyah Bersanad · Terapis Utama
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-stone-600 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shrink-0 font-medium">
                    Durasi: 60 Menit
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="text-xs text-stone-500">
                  Layanan: <span className="font-semibold text-stone-800">{selectedService?.title}</span>
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Pilih Tanggal & Jam</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PILIH TANGGAL & SLOT WAKTU REAL-TIME */}
          {step === 2 && (
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Jadwal & Ketersediaan Slot</h3>
                  <p className="text-xs text-stone-500">
                    Terapis: <span className="font-semibold text-stone-800">{selectedTherapist?.name}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ubah Layanan</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Pilih Tanggal Terapi
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Klinik buka setiap hari: 08:00 - 21:00 WIB (Sesuai janji temu).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Pilih Jam Terapi
                  </label>
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      Tersedia
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                      Sudah Terisi
                    </span>
                  </div>
                </div>

                {slotsLoading ? (
                  <div className="p-8 text-center text-sm text-stone-500 bg-stone-50 rounded-xl">
                    Memeriksa ketersediaan slot jadwal...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                    {availableSlots.map((slotItem) => (
                      <button
                        key={slotItem.time}
                        type="button"
                        disabled={!slotItem.isAvailable}
                        onClick={() => setSelectedSlot(slotItem.time)}
                        className={`p-3 rounded-xl border text-left transition-all text-xs font-medium w-full min-w-0 ${
                          !slotItem.isAvailable
                            ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed line-through'
                            : selectedSlot === slotItem.time
                            ? 'border-emerald-700 bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-700'
                            : 'border-stone-200 bg-white text-stone-800 hover:border-emerald-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-semibold break-words leading-tight">{slotItem.time}</span>
                          </div>
                          <span
                            className={`text-[10px] shrink-0 font-medium px-1.5 py-0.5 rounded ${
                              !slotItem.isAvailable
                                ? 'bg-stone-200 text-stone-500'
                                : selectedSlot === slotItem.time
                                ? 'bg-emerald-700 text-amber-200'
                                : 'bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            {slotItem.isAvailable ? 'Tersedia' : 'Penuh'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Durasi terapi adalah <strong>60 menit</strong> (baik sesi di klinik maupun kunjungan homecare). Waktu pelaksanaan bersifat fleksibel dan disesuaikan berdasarkan <strong>kesepakatan bersama Ustadz Imam Syahrobani, M.Pd</strong>. Tim kami akan mengonfirmasi jam pasti via WhatsApp.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-all"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Isi Data Pasien</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FORM IDENTITAS & KELUHAN PASIEN */}
          {step === 3 && (
            <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Formulir Data & Keluhan Pasien</h3>
                  <p className="text-xs text-stone-500 break-words">
                    Jadwal: <span className="font-semibold text-stone-800">{selectedDate} ({selectedSlot})</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ubah Jadwal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap Pasien *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Ihsan"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp Aktif *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Konfirmasi dan tiket jadwal akan dikirimkan ke nomor ini.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Jenis Kelamin Pasien *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('Laki-laki')}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                        gender === 'Laki-laki'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold'
                          : 'border-stone-200 text-stone-600 bg-white'
                      }`}
                    >
                      Laki-laki (Ikhwan)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('Perempuan')}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                        gender === 'Perempuan'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold'
                          : 'border-stone-200 text-stone-600 bg-white'
                      }`}
                    >
                      Perempuan (Akhwat)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Usia Pasien (Tahun)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Contoh: 35"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Kecamatan / Wilayah (Kab. Kuningan) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Kategori Gejala / Keluhan
                  </label>
                  <select
                    value={symptomCategory}
                    onChange={(e) => setSymptomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Non-Medis & Psikis">Non-Medis & Gangguan Psikis</option>
                    <option value="Medis Fisik Menahun">Keluhan Fisik (Medis Normal tapi Sakit)</option>
                    <option value="Mimpi Buruk & Tidur">Mimpi Buruk / Ketindihan / Susah Tidur</option>
                    <option value="Was-was & Spiritual">Was-was Berlebih & Malas Beribadah</option>
                    <option value="Gangguan Rumah & Usaha">Pembersihan Rumah / Tempat Usaha</option>
                    <option value="Pembersihan Jimat / Klenik">Pembuangan Jimat / Rajah Masa Lalu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Alamat Lengkap (Untuk Kunjungan Homecare atau Catatan Pasien)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jl. Siliwangi No. 12 RT 02/03, Kelurahan Purwawinangun"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Deskripsi Keluhan atau Gejala yang Dirasakan
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan secara ringkas apa yang Anda rasakan (misal: sering sakit di tengkuk saat Maghrib, mimpi ular, rasa was-was saat sholat, dll)."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-all"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Memproses Pendaftaran...</span>
                  ) : (
                    <>
                      <span>Konfirmasi & Buat Tiket Jadwal</span>
                      <CheckCircle className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BUKTI PENDAFTARAN & TIKET DIGITAL BOOKING */}
          {step === 4 && confirmedBooking && (
            <div className="p-4 sm:p-6 md:p-8 space-y-6 text-stone-900">
              <div className="text-center pb-6 border-b border-stone-100">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 [text-wrap:balance]">
                  Jadwal Pasien Berhasil Didaftarkan!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
                  Alhamdulillah, data pendaftaran telah tersimpan di sistem Ruqyah Kuningan. Silakan simpan kode booking berikut.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="p-4 sm:p-6 rounded-2xl bg-stone-900 text-white border border-stone-800 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
                  <div>
                    <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                      Tiket Digital Pasien
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      Ruqyah Syar'iyyah Kuningan
                    </h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-stone-400 block">Status Jadwal:</span>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {confirmedBooking.status === 'menunggu_konfirmasi' ? 'Menunggu Konfirmasi' : 'Dikonfirmasi'}
                    </span>
                  </div>
                </div>

                <div className="py-3 sm:py-4 my-2 flex items-center justify-between gap-2 sm:gap-4 bg-stone-800/60 rounded-xl px-3 sm:px-4 border border-stone-700/50">
                  <div className="min-w-0">
                    <div className="text-[11px] text-stone-400">Kode Booking Anda:</div>
                    <div className="text-lg sm:text-2xl font-mono font-extrabold text-amber-400 tracking-wider truncate">
                      {confirmedBooking.bookingCode}
                    </div>
                  </div>
                  <button
                    onClick={copyBookingCode}
                    className="px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-xs font-medium text-stone-200 flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="min-w-0">
                    <span className="text-stone-400 block">Nama Pasien:</span>
                    <span className="font-semibold text-stone-100 break-words">{confirmedBooking.patientName}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-stone-400 block">Nomor WhatsApp:</span>
                    <span className="font-semibold text-stone-100">{confirmedBooking.phone}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-stone-400 block">Layanan:</span>
                    <span className="font-semibold text-stone-100 break-words">{confirmedBooking.serviceTitle}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-stone-400 block">Terapis:</span>
                    <span className="font-semibold text-stone-100 break-words">{confirmedBooking.therapistName}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-stone-400 block">Tanggal:</span>
                    <span className="font-semibold text-stone-100 tabular-nums">{confirmedBooking.date}</span>
                  </div>
                  <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                    <span className="text-stone-400 block">Jam Terapi:</span>
                    <span className="font-semibold text-stone-100 break-words leading-tight">{confirmedBooking.slot}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 min-w-0">
                    <span className="text-stone-400 block">Lokasi / Wilayah:</span>
                    <span className="font-semibold text-stone-100 break-words">{confirmedBooking.district}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Print */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={createWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Kirim Tiket ke WhatsApp Official</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-medium text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4 text-stone-600" />
                  <span>Cetak / Simpan Tiket</span>
                </button>
              </div>

              {/* Petunjuk Persiapan Sebelum Ruqyah */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-stone-700 space-y-1.5">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Petunjuk Persiapan Pasien Sebelum Terapi:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-stone-600">
                  <li>Berwudhu dengan sempurna dari rumah sebelum menuju ke ruang terapi klinik.</li>
                  <li>Memperbanyak istighfar dan meluruskan niat bahwa kesembuhan mutlak milik Allah Ta’ala.</li>
                  <li>Mengenakan pakaian yang menutup aurat dan longgar (pasien akhwat wajib didampingi mahram).</li>
                  <li>Memastikan tidak membawa atau menyimpan jimat, rajah, keris, atau benda klenik lainnya.</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setStep(1);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium"
                >
                  Daftarkan Pasien Lain
                </button>

                {onOpenTracking && (
                  <button
                    type="button"
                    onClick={onOpenTracking}
                    className="text-xs text-emerald-800 hover:underline font-semibold"
                  >
                    Buka Halaman Cek Status Tiket &rarr;
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
