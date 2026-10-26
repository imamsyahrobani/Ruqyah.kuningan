import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  CheckCircle,
  Clock,
  Calendar,
  Phone,
  FileEdit,
  Trash2,
  RefreshCw,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Appointment } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onDataUpdated
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected appointment for detail / edit
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<Appointment['status']>('menunggu_konfirmasi');
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.success && data.data) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAppointments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectToEdit = (apt: Appointment) => {
    setEditingAppointment(apt);
    setNotesInput(apt.therapistNotes || '');
    setStatusInput(apt.status);
    setActionMessage(null);
  };

  const handleSaveUpdate = async () => {
    if (!editingAppointment) return;
    setSavingEdit(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusInput,
          therapistNotes: notesInput
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memperbarui status');
      }

      setActionMessage('Perubahan berhasil disimpan');
      // Update local state
      setAppointments((prev) =>
        prev.map((a) => (a.id === editingAppointment.id ? data.data : a))
      );
      setEditingAppointment(data.data);
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      setActionMessage(err.message || 'Gagal menyimpan pembaruan');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus jadwal pasien ini?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        if (editingAppointment?.id === id) {
          setEditingAppointment(null);
        }
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  // Filter list
  const filteredList = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      apt.patientName.toLowerCase().includes(q) ||
      apt.bookingCode.toLowerCase().includes(q) ||
      apt.phone.includes(q) ||
      apt.district.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const countPending = appointments.filter((a) => a.status === 'menunggu_konfirmasi').length;
  const countConfirmed = appointments.filter((a) => a.status === 'dikonfirmasi').length;
  const countDone = appointments.filter((a) => a.status === 'selesai').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Panel Manajemen Jadwal Pasien Ruqyah Kuningan</span>
            </h3>
            <p className="text-xs text-stone-400">
              Sistem backend penjadwalan & rekam catatan terapis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-stone-100 border-b border-stone-200 text-xs shrink-0">
          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-stone-500 block">Total Pasien:</span>
            <span className="text-base font-bold text-stone-900 tabular-nums">{appointments.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-amber-800 block">Menunggu Konfirmasi:</span>
            <span className="text-base font-bold text-amber-900 tabular-nums">{countPending}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 block">Dikonfirmasi:</span>
            <span className="text-base font-bold text-emerald-950 tabular-nums">{countConfirmed}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-600 block">Selesai Terapi:</span>
            <span className="text-base font-bold text-stone-800 tabular-nums">{countDone}</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({appointments.length})
            </button>
            <button
              onClick={() => setFilterStatus('menunggu_konfirmasi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'menunggu_konfirmasi' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Menunggu ({countPending})
            </button>
            <button
              onClick={() => setFilterStatus('dikonfirmasi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'dikonfirmasi' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Dikonfirmasi ({countConfirmed})
            </button>
            <button
              onClick={() => setFilterStatus('selesai')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'selesai' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Selesai ({countDone})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, kode, nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <button
              onClick={fetchAppointments}
              className="p-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body (Split List & Detail) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Appointments Table / List */}
          <div className="lg:col-span-7 overflow-y-auto p-4 border-r border-stone-200 space-y-2.5">
            {loading ? (
              <div className="p-8 text-center text-xs text-stone-500">Memuat data pendaftaran...</div>
            ) : filteredList.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                Tidak ada data jadwal pasien yang sesuai filter.
              </div>
            ) : (
              filteredList.map((apt) => {
                const isSelected = editingAppointment?.id === apt.id;
                return (
                  <div
                    key={apt.id}
                    onClick={() => handleSelectToEdit(apt)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-stone-900">
                        {apt.bookingCode}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${
                          apt.status === 'dikonfirmasi'
                            ? 'text-emerald-800'
                            : apt.status === 'selesai'
                            ? 'text-stone-600'
                            : apt.status === 'dibatalkan'
                            ? 'text-red-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {apt.status === 'menunggu_konfirmasi'
                          ? 'Menunggu'
                          : apt.status === 'dikonfirmasi'
                          ? 'Dikonfirmasi'
                          : apt.status === 'selesai'
                          ? 'Selesai'
                          : 'Dibatalkan'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-stone-900">
                      {apt.patientName} <span className="font-normal text-stone-500">({apt.gender})</span>
                    </div>

                    <div className="text-[11px] text-stone-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>{apt.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{apt.slot}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-800 font-medium">{apt.district}</span>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-1 italic mt-1">
                      "{apt.symptoms}"
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail / Editor Panel */}
          <div className="lg:col-span-5 overflow-y-auto p-4 sm:p-6 bg-stone-50 flex flex-col justify-between">
            {editingAppointment ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 block">Kode: {editingAppointment.bookingCode}</span>
                    <h4 className="text-sm font-bold text-stone-900">{editingAppointment.patientName}</h4>
                  </div>
                  <button
                    onClick={() => handleDelete(editingAppointment.id)}
                    className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg hover:bg-stone-200 transition-colors"
                    title="Hapus Jadwal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">WhatsApp:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-stone-900">{editingAppointment.phone}</span>
                      <a
                        href={`https://wa.me/${editingAppointment.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Assalamu'alaikum ${editingAppointment.patientName}, kami dari Ruqyah Kuningan mengonfirmasi jadwal terapi 60 menit Anda bersama Ustadz Imam Syahrobani, M.Pd pada ${editingAppointment.date} (${editingAppointment.slot}) bertempat di Rumah Quran Kuningan, Jl Cemara C1-C2 Perumahan Alam Asri Desa Gerba Kec Kramatmulya.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-900"
                        title="Chat WA Pasien"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Layanan:</span>
                    <span className="font-semibold text-stone-900 text-right">{editingAppointment.serviceTitle}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Terapis:</span>
                    <span className="font-semibold text-stone-900">{editingAppointment.therapistName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Tanggal & Slot:</span>
                    <span className="font-semibold text-stone-900">
                      {editingAppointment.date} ({editingAppointment.slot})
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 block mb-0.5">Alamat / Wilayah:</span>
                    <span className="text-stone-800">{editingAppointment.address || editingAppointment.district}</span>
                  </div>

                  <div>
                    <span className="text-stone-500 block mb-0.5">Keluhan Pasien:</span>
                    <p className="p-2.5 bg-white rounded-lg border border-stone-200 text-stone-700 text-[11px] leading-relaxed">
                      {editingAppointment.symptoms}
                    </p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Ubah Status Jadwal:
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as Appointment['status'])}
                      className="w-full p-2 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                      <option value="dikonfirmasi">Dikonfirmasi (Siap Terapi)</option>
                      <option value="selesai">Selesai Terapi</option>
                      <option value="dibatalkan">Dibatalkan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Catatan Terapis / Rekam Terapi Pasien:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Masukkan catatan perkembangan pasien, reaksi saat ruqyah, atau anjuran herbal bidara..."
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  {actionMessage && (
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-[11px]">
                      {actionMessage}
                    </div>
                  )}

                  <button
                    onClick={handleSaveUpdate}
                    disabled={savingEdit}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-amber-300" />
                    <span>{savingEdit ? 'Menyimpan...' : 'Simpan Pembaruan Status'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-xs text-stone-400 p-8">
                Pilih salah satu jadwal di samping untuk melihat rincian dan memperbarui status atau catatan terapi.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
