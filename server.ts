import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Admin auth (in-memory token store)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ruqyahkuningan2026';
const adminTokens = new Set<string>();

function generateToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function requireAdmin(req: Request, res: Response, next: () => void): void {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !adminTokens.has(token)) {
    res.status(401).json({ success: false, message: 'Akses ditolak. Silakan login sebagai terapis.' });
    return;
  }
  next();
}

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Password salah' });
  }
  const token = generateToken();
  adminTokens.add(token);
  res.json({ success: true, token });
});

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial mock appointments if file doesn't exist
const initialAppointments = [
  {
    id: 'apt-1',
    bookingCode: 'RK-20261026-101',
    patientName: 'H. Dedi Suhanda',
    phone: '081234567890',
    gender: 'Laki-laki',
    age: 48,
    district: 'Kecamatan Kuningan',
    address: 'Jl. Veteran No. 42, Kelurahan Kuningan',
    serviceId: 'srv-ruqyah-klinik',
    serviceTitle: "Ruqyah Syar'iyyah Personal di Klinik (60 Menit)",
    therapistId: 'th-imam',
    therapistName: 'Ustadz Imam Syahrobani, M.Pd',
    date: '2026-10-26',
    slot: 'Pagi (08:30 - 09:30 WIB) - Kesepakatan',
    symptoms: 'Sering merasa sesak di dada saat Maghrib, mimpi buruk berulang kali didatangi binatang buas, emosi tidak stabil.',
    symptomCategory: 'Non-Medis & Psikis',
    status: 'dikonfirmasi',
    therapistNotes: 'Sesi ruqyah 60 menit telah disepakati bersama Ustadz Imam Syahrobani. Disarankan wudhu dan membawa air putih untuk didoakan.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'apt-2',
    bookingCode: 'RK-20261026-102',
    patientName: 'Siti Rahmawati',
    phone: '085712345678',
    gender: 'Perempuan',
    age: 32,
    district: 'Kecamatan Cilimus',
    address: 'Desa Linggarjati, Kec. Cilimus',
    serviceId: 'srv-ruqyah-klinik',
    serviceTitle: "Ruqyah Syar'iyyah Personal di Klinik (60 Menit)",
    therapistId: 'th-imam',
    therapistName: 'Ustadz Imam Syahrobani, M.Pd',
    date: '2026-10-26',
    slot: 'Pagi (10:00 - 11:00 WIB) - Kesepakatan',
    symptoms: 'Pusing berkepanjangan sudah cek medis tidak ada masalah, insomnia berat dan sering merasa cemas was-was tanpa sebab.',
    symptomCategory: 'Medis Fisik & Was-was',
    status: 'dikonfirmasi',
    therapistNotes: 'Pasien muslimah wajib didampingi mahram (suami/keluarga). Waktu pelaksanaan telah disepakati.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'apt-3',
    bookingCode: 'RK-20261027-103',
    patientName: 'Rudi Hermawan',
    phone: '087823456789',
    gender: 'Laki-laki',
    age: 39,
    district: 'Kecamatan Cigugur',
    address: 'Jl. Raya Cigugur No. 15',
    serviceId: 'srv-ruqyah-homecare',
    serviceTitle: 'Ruqyah Homecare (Kunjungan Rumah Kuningan - 60 Menit)',
    therapistId: 'th-imam',
    therapistName: 'Ustadz Imam Syahrobani, M.Pd',
    date: '2026-10-27',
    slot: 'Siang (13:30 - 14:30 WIB) - Kesepakatan',
    symptoms: 'Keluarga sering berselisih hebat di rumah, ada bunyi aneh di atap rumah saat tengah malam, anggota keluarga sakit bergantian.',
    symptomCategory: 'Gangguan Rumah & Lingkungan',
    status: 'menunggu_konfirmasi',
    therapistNotes: 'Jadwal kunjungan homecare 60 menit sedang dikoordinasikan kesepakatan jam pastinya.',
    createdAt: new Date().toISOString(),
  }
];

if (!fs.existsSync(APPOINTMENTS_FILE)) {
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(initialAppointments, null, 2), 'utf-8');
}

function getAppointments(): any[] {
  try {
    const raw = fs.readFileSync(APPOINTMENTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return initialAppointments;
  }
}

function saveAppointments(data: any[]): void {
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Articles (Blog) storage
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

const initialArticles = [
  {
    id: 'art-1',
    slug: 'tanda-tanda-gangguan-ruqyah',
    title: 'Tanda-Tanda Gangguan Jin, Sihir, dan ‘Ain yang Sering Diabaikan',
    excerpt: 'Kenali indikasi awal gangguan rohani seperti mimpi buruk berulang, was-was ekstrem, dan sakit fisik tanpa sebab medis, serta langkah penanganan syar’i.',
    category: 'Edukasi',
    author: 'Ustadz Imam Syahrobani, M.Pd',
    publishedAt: '2026-10-20T08:00:00.000Z',
    tags: ['ruqyah', 'sihir', 'ain', 'was-was'],
    content: `## Pendahuluan

Banyak orang mengalami gangguan rohani tanpa menyadarinya. Tanda-tanda seperti mimpi buruk berulang, rasa was-was ekstrem saat beribadah, hingga sakit fisik yang tidak ditemukan penyebab medisnya, sering diabaikan.

## Tanda-Tanda Umum

1. **Mimpi buruk berulang** — didatangi binatang buas, dikejar, atau jatuh dari tempat tinggi.
2. **Was-was ekstrem** — keraguan berlebihan saat sholat, wudhu, atau membaca Al-Qur’an.
3. **Sakit fisik tanpa sebab medis** — sakit tengkuk, dada sesak, atau kesemutan mendadak.
4. **Perubahan perilaku** — mudah marah, malas ibadah, atau menjauh dari keluarga.
5. **Gangguan di rumah** — bunyi aneh tengah malam, anggota keluarga sakit bergantian.

## Langkah Penanganan Syar’i

- Perbanyak istighfar dan sholat fardhu tepat waktu.
- Rutinkan dzikir pagi dan petang serta membaca Ayat Kursi setelah sholat.
- Mandi dengan air yang dibacakan ruqyah atau air daun bidara.
- Konsultasikan dengan terapis ruqyah bersanad bila gejala menetap.

## Penutup

Gangguan rohani bukan aib. Dengan taubat, dzikir, dan ruqyah syar’iyyah, insya Allah kesembuhan akan datang dengan izin Allah Ta’ala.`
  },
  {
    id: 'art-2',
    slug: 'cara-ruqyah-mandiri-di-rumah',
    title: 'Cara Ruqyah Mandiri di Rumah Sesuai Sunnah',
    excerpt: 'Panduan praktis meruqyah diri dan keluarga dengan ayat-ayat Al-Qur’an dan air ruqyah, tanpa ketergantungan pada terapis.',
    category: 'Panduan',
    author: 'Ustadz Imam Syahrobani, M.Pd',
    publishedAt: '2026-10-22T09:30:00.000Z',
    tags: ['ruqyah mandiri', 'air bidara', 'dzikir'],
    content: `## Persiapan

1. Berwudhu dengan sempurna.
2. Pilih waktu yang tenang, misalnya setelah sholat Subuh atau sebelum tidur.
3. Siapkan air putih bersih dalam wadah.

## Bacaan Ruqyah

- Al-Fatihah (7x)
- Ayat Kursi (3x)
- Al-Ikhlas, Al-Falaq, An-Nas (3x masing-masing)
- Doa perlindungan: *"A'udzu bikalimatillahit-tammati min kulli syaithanin wa hammatin wa min kulli 'ainin lammah."*

## Praktik

- Baca ayat-ayat di atas sambil meniup ke telapak tangan, lalu usapkan ke seluruh tubuh.
- Tiupkan juga ke air, lalu minum dan mandi dengan air tersebut.
- Rutinkan selama 7 hari berturut-turut.

## Catatan

Ruqyah mandiri adalah sebab. Kesembuhan mutlak hanya dari Allah. Jika gejala berat menetap, segera jadwalkan sesi ruqyah syar’iyyah dengan terapis bersanad.`
  },
  {
    id: 'art-3',
    slug: 'perbedaan-ruqyah-syar-iyyah-dan-dukun',
    title: 'Perbedaan Ruqyah Syar’iyyah dan Praktik Dukun/Klenik',
    excerpt: 'Kenali ciri-ciri ruqyah yang sesuai Sunnah versus praktik perdukunan yang dilarang, agar tidak terjerumus syirik.',
    category: 'Tauhid',
    author: 'Ustadz Imam Syahrobani, M.Pd',
    publishedAt: '2026-10-24T10:00:00.000Z',
    tags: ['tauhid', 'syirik', 'edukasi'],
    content: `## Ruqyah Syar’iyyah (Sunnah)

- Menggunakan ayat-ayat Al-Qur’an dan doa Nabawiyyah.
- Bacaan jelas, terdengar, tanpa komat-kamit.
- Meyakini ruqyah hanya sebab, kesembuhan dari Allah.
- Pasien akhwat didampingi mahram, menjaga aurat.
- Mengajarkan taubat dan membuang jimat.

## Praktik Dukun/Klenik (Haram)

- Meminta syarat ganjil (ayam cemani, kain kafan, sesajen).
- Memberikan jimat, rajah, keris bertuah.
- Mengklaim tahu masa depan atau menuduh orang lain.
- Membaca mantra bisik-bisik tidak jelas.
- Menyuruh ritual bertentangan syariat.

## Kesimpulan

Pastikan terapis yang Anda pilih berlandaskan tuntunan Rasulullah ﷺ dan fatwa ulama Ahlussunnah, tanpa menyekutukan Allah.`
  }
];

if (!fs.existsSync(ARTICLES_FILE)) {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(initialArticles, null, 2), 'utf-8');
}

function getArticles(): any[] {
  try {
    const raw = fs.readFileSync(ARTICLES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return initialArticles;
  }
}

function saveArticles(data: any[]): void {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Master data
const SERVICES = [
  {
    id: 'srv-ruqyah-klinik',
    title: "Ruqyah Syar'iyyah Personal di Klinik",
    shortDesc: "Sesi ruqyah intensif satu lawan satu bersama Ustadz Imam Syahrobani, M.Pd di ruang terapi klinik yang tenang dan kondusif.",
    duration: '60 Menit',
    target: 'Individu (Ikhwan/Akhwat)',
    includes: [
      'Konsultasi diagnosa syar’i awal',
      'Tilawah ayat-ayat ruqyah intensif (60 menit)',
      'Terapi air zam-zam / bidara terfasilitasi',
      'Edukasi amalan perlindungan mandiri',
      'Jadwal fleksibel berdasarkan kesepakatan'
    ],
    infak: 'Infaq Sukarela / Sesuai Keikhlasan',
    recommendedFor: 'Was-was berat, mimpi buruk, gangguan jin/sihir/ain, kecemasan rohani'
  },
  {
    id: 'srv-ruqyah-homecare',
    title: "Ruqyah Homecare (Kunjungan ke Rumah Kuningan)",
    shortDesc: "Ustadz Imam Syahrobani, M.Pd dan tim datang langsung ke rumah pasien untuk pasien yang berhalangan atau pembersihan rumah.",
    duration: '60 Menit',
    target: 'Keluarga & Pasien di Kediaman',
    includes: [
      'Kunjungan langsung ke seluruh 32 kecamatan di Kab. Kuningan',
      'Ruqyah pasien intensif di kediaman (60 menit)',
      'Edukasi penyingkiran benda bertentangan syariat (jimat/rajah)',
      'Teknik semprotan air ruqyah untuk sudut rumah',
      'Jadwal fleksibel berdasarkan kesepakatan'
    ],
    infak: 'Infaq + Pengganti Transport Terapis',
    recommendedFor: 'Pasien stroke/lumpuh/tidak bisa jalan, rumah sering terjadi keganjilan'
  },
  {
    id: 'srv-ruqyah-usaha',
    title: "Ruqyah Tempat Usaha, Toko & Kantor",
    shortDesc: "Pembersihan spiritual tempat perniagaan dari gangguan 'ain, hasad kompetitor, atau sihir penutup rezeki.",
    duration: '60 Menit',
    target: 'Toko, Ruko, Pabrik, Kantor di Kuningan',
    includes: [
      'Pengecekan fisik dan spiritual tempat usaha',
      'Tilawah ruqyah penawar sihir penglaris batil (60 menit)',
      'Bimbingan pembuatan air ruqyah semprot untuk toko',
      'Jadwal fleksibel berdasarkan kesepakatan'
    ],
    infak: 'Infaq Operasional',
    recommendedFor: 'Toko mendadak sepi drastis tanpa sebab wajar, aura tempat terasa pengap/menakutkan'
  },
  {
    id: 'srv-ruqyah-mandiri',
    title: 'Bimbingan Ruqyah Mandiri (Konsultasi Privat)',
    shortDesc: 'Pelatihan privat bersama Ustadz Imam Syahrobani, M.Pd agar pasien mampu meruqyah diri sendiri dan keluarga tanpa ketergantungan pada terapis.',
    duration: '60 Menit',
    target: 'Kepala Keluarga / Muslimin-Muslimat',
    includes: [
      'Buku panduan dzikir pagi petang & ayat ruqyah',
      'Praktek langsung cara membaca dan meniup (60 menit)',
      'Teknik ruqyah air dan minyak zaitun',
      'Jadwal fleksibel berdasarkan kesepakatan'
    ],
    infak: 'Infaq Dakwah Sukarela',
    recommendedFor: 'Membangun benteng diri harian, menjaga anak-anak dari ‘ain'
  }
];

const THERAPISTS = [
  {
    id: 'th-imam',
    name: 'Ustadz Imam Syahrobani, M.Pd',
    title: 'Founder Ruqyah Kuningan & Ketua QHI Kab. Kuningan',
    specialty: 'Penanganan Gangguan Jin, Sihir, ‘Ain, Was-was & Pembersihan Rumah/Tempat Usaha',
    gender: 'Laki-laki',
    experience: '15 Tahun Praktisi Ruqyah Syar’iyyah',
    education: 'Magister Pendidikan & Praktisi Senior Quranic Healing International (QHI)',
    scheduleDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'],
    availableSlots: [
      'Pagi (08:30 - 09:30 WIB) - Kesepakatan',
      'Pagi (10:00 - 11:00 WIB) - Kesepakatan',
      'Siang (13:30 - 14:30 WIB) - Kesepakatan',
      'Sore (16:00 - 17:00 WIB) - Kesepakatan',
      'Malam (19:30 - 20:30 WIB) - Kesepakatan',
      'Jam Khusus (Sesuai Kesepakatan)'
    ],
    bio: 'Pendiri Ruqyah Kuningan dan Ketua DPD Quranic Healing International (QHI) Kabupaten Kuningan dengan pengalaman 15 tahun mendampingi ribuan pasien di Kuningan dan sekitarnya dengan pendekatan ilmiah syar’i, ramah, dan bebas dari klenik.'
  }
];

const KUNINGAN_DISTRICTS = [
  'Kecamatan Kuningan (Pusat Kota)',
  'Kecamatan Cigugur',
  'Kecamatan Cilimus',
  'Kecamatan Jalaksana',
  'Kecamatan Kramatmulya',
  'Kecamatan Ciawigebang',
  'Kecamatan Luragung',
  'Kecamatan Kadugede',
  'Kecamatan Mandirancan',
  'Kecamatan Darma',
  'Kecamatan Pasawahan',
  'Kecamatan Cidahu',
  'Kecamatan Lebakwangi',
  'Kecamatan Garawangi',
  'Kecamatan Sindangagung',
  'Kecamatan Selajambe',
  'Kecamatan Subang',
  'Kecamatan Ciwaru',
  'Kecamatan Cibingbin',
  'Kecamatan Japara',
  'Kecamatan Hantara',
  'Kecamatan Nusaherang',
  'Luar Kabupaten Kuningan (Cirebon / Majalengka)'
];

const TIME_SLOTS = [
  'Pagi (08:30 - 09:30 WIB) - Kesepakatan',
  'Pagi (10:00 - 11:00 WIB) - Kesepakatan',
  'Siang (13:30 - 14:30 WIB) - Kesepakatan',
  'Sore (16:00 - 17:00 WIB) - Kesepakatan',
  'Malam (19:30 - 20:30 WIB) - Kesepakatan',
  'Jam Khusus (Sesuai Kesepakatan)'
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Apakah Anda sering mengalami mimpi buruk berulang (seperti jatuh dari ketinggian, dikejar hewan buas hitam, ular, atau mayat)?',
    category: 'Mimpi & Tidur',
    weight: 2
  },
  {
    id: 2,
    question: 'Sering merasa ketindihan (sleep paralysis) disertai sesak napas berat dan bayangan gelap saat akan tidur?',
    category: 'Mimpi & Tidur',
    weight: 2
  },
  {
    id: 3,
    question: 'Sering merasakan sakit fisik (pundak berat, sakit kepala sebelah, perut panas) yang setelah dicek ke dokter/lab dinyatakan normal?',
    category: 'Fisik Medis',
    weight: 3
  },
  {
    id: 4,
    question: 'Apakah emosi Anda sering meledak-ledak tidak terkontrol kepada pasangan/keluarga karena hal sangat sepele?',
    category: 'Psikis & Emosional',
    weight: 2
  },
  {
    id: 5,
    question: 'Merasa malas luar biasa, mengantuk sangat berat, atau gelisah ketika hendak sholat, membaca Al-Qur’an, atau mendengar Adzan?',
    category: 'Spiritual',
    weight: 3
  },
  {
    id: 6,
    question: 'Sering merasa ada yang memperhatikan, membisikkan keraguan (was-was ekstrem), atau menyuruh mencelakai diri sendiri?',
    category: 'Was-was & Bisikan',
    weight: 3
  },
  {
    id: 7,
    question: 'Merasakan ada hawa dingin atau panas aneh berpindah-pindah di sekujur tubuh, atau kedutan konstan di bagian tubuh tertentu?',
    category: 'Fisik Sensori',
    weight: 2
  },
  {
    id: 8,
    question: 'Pernah memiliki atau menyimpan benda warisan bertuah (keris, rajah, wafaq, jimat, sabuk kebal) atau pernah pasang susuk?',
    category: 'Riwayat Klenik',
    weight: 4
  },
  {
    id: 9,
    question: 'Apakah di rumah sering tercium bau anyir/busuk/melati sesaat tanpa sumber, atau sering terdengar ketukan/suara pasir di atap?',
    category: 'Lingkungan Rumah',
    weight: 2
  },
  {
    id: 10,
    question: 'Sering merasa sesak di dada dan gelisah tiba-tiba menjelang waktu Maghrib hingga Isya?',
    category: 'Waktu & Fisiologis',
    weight: 2
  }
];

const DOA_DZIKIR = [
  {
    id: 'doa-1',
    title: 'Surah Al-Fatihah (Ummul Kitab / Asy-Syafiyah)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    latin: 'Bismillahir-rahmanir-rahim. Alhamdu lillahi rabbil-alamin. Ar-rahmanir-rahim. Maliki yawmid-din. Iyyaka na’budu wa iyyaka nasta’in. Ihdinas-siratal-mustaqim. Siratalladhina an’amta ‘alayhim ghayril-maghdubi ‘alayhim walad-dallin.',
    translation: 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Rabb semesta alam. Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus, (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
    benefit: "Asy-Syifa (penawar racun dan penyakit), dibaca 3x atau 7x sambil meletakkan tangan kanan di area yang sakit lalu ditiupkan.",
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
  },
  {
    id: 'doa-2',
    title: 'Ayat Kursi (Surah Al-Baqarah: 255)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: "Allahu la ilaha illa huwal-hayyul-qayyum, la ta'khudhuhu sinatuw-wala nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifzuhuma, wa huwal-'aliyyul-'azim.",
    translation: 'Allah, tidak ada Rabb (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafaat di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.',
    benefit: 'Pelindung terkuat dari gangguan setan dan jin saat tidur dan di rumah, dibaca setelah sholat fardhu dan sebelum tidur.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3'
  },
  {
    id: 'doa-3',
    title: 'Al-Mu’awwidzat (Al-Ikhlas, Al-Falaq, An-Nas)',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
    latin: "Qul Huwallahu Ahad... Qul A'udzu bi Rabbil Falaq... Qul A'udzu bi Rabbin Naas...",
    translation: 'Katakanlah: Dialah Allah, Yang Maha Esa... Katakanlah: Aku berlindung kepada Rabb Yang Menguasai subuh, dari kejahatan makhluk-Nya... Katakanlah: Aku berlindung kepada Rabb (yang memelihara dan menguasai) manusia...',
    benefit: 'Benteng dari sihir, hasad, dan penyakit ‘ain. Dibaca 3x pada pagi dan petang, serta ditiupkan ke kedua telapak tangan lalu diusapkan ke seluruh tubuh sebelum tidur.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6236.mp3'
  },
  {
    id: 'doa-4',
    title: 'Doa Menghilangkan Sakit dan Penyakit Fisik (HR. Muslim)',
    arabic: 'أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧ مَرَّاتٍ)',
    latin: "A'udzu billahi wa qudratihi min syarri ma ajidu wa uhadziru (7 kali)",
    translation: 'Aku berlindung kepada Allah dan kekuasaan-Nya dari keburukan apa yang aku rasakan dan aku khawatirkan.',
    benefit: 'Letakkan tangan pada bagian tubuh yang sakit, baca Bismillah 3 kali, lalu baca doa ini sebanyak 7 kali.',
    audioUrl: ''
  },
  {
    id: 'doa-5',
    title: 'Doa Perlindungan Sempurna dari Gangguan Setan (HR. Bukhari)',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    latin: "A'udzu bikalimatillahit-tammati min kulli syaithanin wa hammatin wa min kulli 'ainin lammah.",
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna, dari setiap setan, binatang berbisa, dan dari setiap pandangan mata yang jahat (penyakit ‘ain).',
    benefit: 'Doa yang dibacakan Nabi Ibrahim AS kepada Ismail dan Ishaq, serta Nabi Muhammad SAW kepada Hasan dan Husain.',
    audioUrl: ''
  }
];

const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'H. Ahmad Suhanda',
    age: 52,
    role: 'Wiraswasta',
    district: 'Kecamatan Cigugur',
    serviceType: "Ruqyah Syar'iyyah Personal di Klinik (60 Menit)",
    therapist: 'Ustadz Imam Syahrobani, M.Pd',
    beforeCondition: 'Dada terasa sesak berat setiap menjelang Maghrib, sakit kepala sebelah menahun yang setelah 3 kali cek lab dan scan medis dinyatakan tidak ada masalah klinis.',
    afterCondition: 'Alhamdulillah setelah 2 sesi ruqyah 60 menit dan dibimbing amalan taubat serta wudhu sebelum tidur, beban di dada langsung terangkat. Sudah 4 bulan tidak pernah kambuh lagi.',
    quote: 'Ustadz Imam Syahrobani membimbing dengan sangat ilmiah, tenang, dan ramah syar’i. Tidak ada mantra aneh atau benda klenik, murni tilawah Al-Qur’an. Sekarang hati lapang dan ibadah kembali khusyuk.',
    category: 'medis_fisik',
    date: '14 Oktober 2026',
    verifiedBooking: true
  },
  {
    id: 't-2',
    name: 'Ibu Rahmawati',
    age: 38,
    role: 'Ibu Rumah Tangga',
    district: 'Kecamatan Cilimus',
    serviceType: "Ruqyah Syar'iyyah Personal di Klinik (60 Menit)",
    therapist: 'Ustadz Imam Syahrobani, M.Pd',
    beforeCondition: 'Was-was berlebihan saat sholat dan wudhu hingga mengulang berkali-kali, emosi mudah meledak tanpa alasan ke anak-anak, dan mimpi buruk ular hitam berulang.',
    afterCondition: 'Didampingi suami saat diterapi ruqyah 60 menit oleh Ustadz Imam Syahrobani di klinik. Barang jimat peninggalan orang tua dimusnahkan. Pikiran menjadi jernih dan damai.',
    quote: 'Ustadz Imam sangat menjaga adab syariat dalam meruqyah, tetap santun dan profesional dengan didampingi mahram saya. Sangat bersyukur ada bimbingan Ruqyah Kuningan yang amanah.',
    category: 'psikis_waswas',
    date: '28 September 2026',
    verifiedBooking: true
  },
  {
    id: 't-3',
    name: 'Dani Kurniawan & Keluarga',
    age: 44,
    role: 'Aparatur Sipil Negara',
    district: 'Kecamatan Jalaksana',
    serviceType: 'Ruqyah Homecare (Kunjungan Rumah Kuningan - 60 Menit)',
    therapist: 'Ustadz Imam Syahrobani, M.Pd',
    beforeCondition: 'Rumah terasa panas dan hawa mencekam, anak balita selalu menangis menjerit tengah malam di jam 2 dini hari, dan sering terdengar ketukan pasir di atas atap genteng.',
    afterCondition: 'Ustadz Imam Syahrobani datang langsung ke rumah sesuai kesepakatan jadwal, memandu pembersihan sudut rumah dengan semprotan air daun bidara ruqyah, serta bimbingan adab dzikir rumah. Rumah kembali sejuk dan anak tidur lelap.',
    quote: 'Layanan homecare sangat membantu keluarga kami di Jalaksana. Beliau datang tepat waktu, mengedukasi tanpa menakut-nakuti, dan memberikan solusi tuntas sesuai Sunnah.',
    category: 'homecare',
    date: '02 Oktober 2026',
    verifiedBooking: true
  },
  {
    id: 't-4',
    name: 'Hj. Endang S.',
    age: 59,
    role: 'Pensiunan Guru',
    district: 'Kecamatan Ciawigebang',
    serviceType: "Ruqyah Syar'iyyah Personal di Klinik (60 Menit)",
    therapist: 'Ustadz Imam Syahrobani, M.Pd',
    beforeCondition: 'Pundak dan tengkuk kaku seperti memikul beban berat berbulan-bulan, migrain hebat, dan tangan sering kesemutan mendadak saat hendak sujud sholat.',
    afterCondition: 'Setelah dibacakan ruqyah syar’iyyah intensif 60 menit dan dibekali air daun bidara ruqyah, badan terasa sangat enteng dan rasa kaku di pundak hilang seketika biidznillah.',
    quote: 'Pengalaman 15 tahun Ustadz Imam Syahrobani sangat terasa. Bacaan Al-Qur’annya sangat tartil dan meresap ke dalam jiwa. Sangat menenteramkan hati.',
    category: 'medis_fisik',
    date: '18 Oktober 2026',
    verifiedBooking: true
  },
  {
    id: 't-5',
    name: 'Sdr. Fajar Maulana',
    age: 27,
    role: 'Karyawan Swasta',
    district: 'Kecamatan Kuningan (Pusat Kota)',
    serviceType: 'Bimbingan Ruqyah Mandiri (Konsultasi Privat - 60 Menit)',
    therapist: 'Ustadz Imam Syahrobani, M.Pd',
    beforeCondition: 'Ketindihan (sleep paralysis) hampir setiap malam, sering melihat bayangan hitam di sudut kamar kos, malas luar biasa untuk bangun sholat Shubuh.',
    afterCondition: 'Diberikan arahan benteng diri, amalan dzikir pagi petang, dan teknik ruqyah mandiri tiup ke telapak tangan. Gejala ketindihan hilang total sejak hari ke-3.',
    quote: 'Saya diajari cara mandiri membentengi diri sendiri agar tidak bergantung pada terapis. Sangat mencerahkan aqidah dan membuat kita makin dekat kepada Allah.',
    category: 'psikis_waswas',
    date: '22 Oktober 2026',
    verifiedBooking: true
  },
  {
    id: 't-6',
    name: 'Bpk. Mulyadi',
    age: 49,
    role: 'Pemilik Rumah Makan',
    district: 'Kecamatan Kramatmulya',
    serviceType: 'Ruqyah Tempat Usaha, Toko & Kantor (60 Menit)',
    therapist: 'Ustadz Imam Syahrobani, M.Pd',
    beforeCondition: 'Warung makan mendadak sepi drastis secara tidak wajar, makanan cepat basi padahal baru dimasak 2 jam, pelanggan mengaku melihat warung tutup padahal buka.',
    afterCondition: 'Pembersihan tempat usaha dari indikasi sihir penutup rezeki dan pandangan ‘ain hasad. Air ruqyah disemprotkan dan dibimbing perbaikan keberkahan muamalah syar’i.',
    quote: 'Alhamdulillah setelah diterapi ruqyah syar’i 60 menit oleh Ustadz Imam Syahrobani dan diajarkan dzikir pelindung tempat usaha, suasana warung kembali terang dan pembeli berangsur normal ramai kembali.',
    category: 'usaha',
    date: '11 Oktober 2026',
    verifiedBooking: true
  }
];

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Ruqyah Kuningan API', timestamp: new Date().toISOString() });
});

// Testimonials
app.get('/api/testimonials', (req: Request, res: Response) => {
  const { category } = req.query;
  let list = TESTIMONIALS;
  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter((t) => t.category === category);
  }
  res.json({ success: true, total: list.length, data: list });
});

// Services
app.get('/api/services', (req: Request, res: Response) => {
  res.json({ success: true, data: SERVICES });
});

// Therapists
app.get('/api/therapists', (req: Request, res: Response) => {
  res.json({ success: true, data: THERAPISTS });
});

// Districts of Kuningan
app.get('/api/districts', (req: Request, res: Response) => {
  res.json({ success: true, data: KUNINGAN_DISTRICTS });
});

// Slots availability for a specific date and therapist
app.get('/api/schedule/slots', (req: Request, res: Response) => {
  const { date, therapistId } = req.query;
  if (!date || typeof date !== 'string') {
    return res.status(400).json({ success: false, message: 'Parameter date (YYYY-MM-DD) wajib disertakan' });
  }

  const appointments = getAppointments();
  
  // Find bookings for this date and therapist (excluding cancelled ones)
  const bookedSlots = appointments
    .filter(a => a.date === date && (!therapistId || a.therapistId === therapistId) && a.status !== 'dibatalkan')
    .map(a => a.slot);

  const slotResults = TIME_SLOTS.map(slot => ({
    time: slot,
    isAvailable: !bookedSlots.includes(slot),
    bookedCount: bookedSlots.filter(s => s === slot).length
  }));

  res.json({
    success: true,
    date,
    therapistId: therapistId || 'all',
    slots: slotResults
  });
});

// Get appointments with filters
app.get('/api/appointments', (req: Request, res: Response) => {
  const { status, date, search } = req.query;
  let list = getAppointments();

  if (status && typeof status === 'string' && status !== 'all') {
    list = list.filter(a => a.status === status);
  }

  if (date && typeof date === 'string') {
    list = list.filter(a => a.date === date);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.bookingCode.toLowerCase().includes(q) ||
      a.patientName.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      a.district.toLowerCase().includes(q)
    );
  }

  // Sort by date and time descending
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, total: list.length, data: list });
});

// Track appointment by code or phone
app.get('/api/appointments/track', (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Harap masukkan nomor WhatsApp atau Kode Booking' });
  }

  const cleanedQuery = query.trim().toLowerCase();
  const list = getAppointments();
  
  const matches = list.filter(a => 
    a.bookingCode.toLowerCase() === cleanedQuery ||
    a.phone.replace(/[^0-9]/g, '').includes(cleanedQuery.replace(/[^0-9]/g, ''))
  );

  if (matches.length === 0) {
    return res.status(404).json({ success: false, message: 'Jadwal pasien tidak ditemukan dengan kata kunci tersebut.' });
  }

  res.json({ success: true, data: matches });
});

// Create new appointment
app.post('/api/appointments', (req: Request, res: Response) => {
  const {
    patientName,
    phone,
    gender,
    age,
    district,
    address,
    serviceId,
    therapistId,
    date,
    slot,
    symptoms,
    symptomCategory
  } = req.body;

  if (!patientName || !phone || !gender || !district || !serviceId || !therapistId || !date || !slot) {
    return res.status(400).json({
      success: false,
      message: 'Mohon lengkapi seluruh formulir pendaftaran wajib (Nama, WhatsApp, Jenis Kelamin, Wilayah, Layanan, Terapis, Tanggal, dan Jam).'
    });
  }

  const appointments = getAppointments();

  // Check if slot is already taken for that therapist on that date
  const isSlotTaken = appointments.some(
    a => a.date === date && a.slot === slot && a.therapistId === therapistId && a.status !== 'dibatalkan'
  );

  if (isSlotTaken) {
    return res.status(409).json({
      success: false,
      message: `Mohon maaf, jadwal pada ${date} pukul ${slot} untuk terapis yang dipilih sudah terisi. Silakan pilih jam atau terapis lainnya.`
    });
  }

  // Find service and therapist titles
  const srv = SERVICES.find(s => s.id === serviceId);
  const th = THERAPISTS.find(t => t.id === therapistId);

  // Generate unique booking code
  const dateFormatted = date.replace(/-/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const bookingCode = `RK-${dateFormatted}-${randomSuffix}`;

  const newAppointment = {
    id: `apt-${Date.now()}`,
    bookingCode,
    patientName: patientName.trim(),
    phone: phone.trim(),
    gender,
    age: age ? parseInt(age, 10) : undefined,
    district,
    address: address ? address.trim() : district,
    serviceId,
    serviceTitle: srv ? srv.title : 'Ruqyah Syar’iyyah',
    therapistId,
    therapistName: th ? th.name : 'Terapis Ruqyah Kuningan',
    date,
    slot,
    symptoms: symptoms ? symptoms.trim() : 'Keluhan umum gangguan ketenangan batin',
    symptomCategory: symptomCategory || 'Konsultasi Ruhani',
    status: 'menunggu_konfirmasi',
    therapistNotes: '',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppointment);
  saveAppointments(appointments);

  res.status(201).json({
    success: true,
    message: 'Jadwal terapi berhasil didaftarkan. Tim Ruqyah Kuningan akan memvalidasi jadwal Anda.',
    data: newAppointment
  });
});

// Update appointment (Status, therapist notes, reschedule)
app.patch('/api/appointments/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, therapistNotes, date, slot } = req.body;

  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === id || a.bookingCode === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan' });
  }

  if (status) appointments[index].status = status;
  if (therapistNotes !== undefined) appointments[index].therapistNotes = therapistNotes;
  if (date) appointments[index].date = date;
  if (slot) appointments[index].slot = slot;
  appointments[index].updatedAt = new Date().toISOString();

  saveAppointments(appointments);

  res.json({ success: true, message: 'Data jadwal berhasil diperbarui', data: appointments[index] });
});

// Delete appointment
app.delete('/api/appointments/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const appointments = getAppointments();
  const filtered = appointments.filter(a => a.id !== id && a.bookingCode !== id);

  if (filtered.length === appointments.length) {
    return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan' });
  }

  saveAppointments(filtered);
  res.json({ success: true, message: 'Jadwal berhasil dihapus' });
});

// Quiz Questions
app.get('/api/quiz-questions', (req: Request, res: Response) => {
  res.json({ success: true, data: QUIZ_QUESTIONS });
});

// Quiz Analyze
app.post('/api/quiz-analyze', (req: Request, res: Response) => {
  const { answers } = req.body; // Array of selected question ids or map { [id]: boolean }
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'Format data kuesioner tidak valid' });
  }

  let totalScore = 0;
  const flaggedCategories: Record<string, number> = {};

  answers.forEach((qId: number) => {
    const q = QUIZ_QUESTIONS.find(item => item.id === qId);
    if (q) {
      totalScore += q.weight;
      flaggedCategories[q.category] = (flaggedCategories[q.category] || 0) + 1;
    }
  });

  let severity = 'Ringan';
  let advice = '';
  let needPersonalTherapy = false;

  if (totalScore <= 4) {
    severity = 'Ringan (Kelelahan Fisik & Was-was Wajar)';
    advice = 'Indikasi gangguan non-medis tergolong rendah. Disarankan merutinkan wudhu sebelum tidur, mendengarkan Al-Qur’an surah Al-Baqarah, serta menjaga dzikir pagi dan petang secara mandiri.';
    needPersonalTherapy = false;
  } else if (totalScore <= 10) {
    severity = 'Sedang (Indikasi Gangguan Psikosomatis / ‘Ain)';
    advice = 'Terdapat beberapa indikasi yang mengarah pada pengaruh psikis, pandangan ‘ain (hasad), atau gangguan jin tingkat awal. Dianjurkan melakukan Ruqyah Mandiri intensif selama 7 hari berturut-turut menggunakan air bidara atau menjadwalkan konsultasi dengan terapis.';
    needPersonalTherapy = true;
  } else {
    severity = 'Tinggi (Memerlukan Pendampingan Ruqyah Syar’iyyah Langsung)';
    advice = 'Skor menunjukkan indikasi kuat adanya gangguan jin, sihir, atau trauma spiritual yang menahun. Sangat disarankan untuk segera menjadwalkan sesi Ruqyah Syar’iyyah intensif dengan terapis bersanad, membersihkan rumah dari benda-benda rajah/jimat, dan memperbaiki sholat fardhu.';
    needPersonalTherapy = true;
  }

  res.json({
    success: true,
    data: {
      score: totalScore,
      maxScore: 25,
      severity,
      advice,
      needPersonalTherapy,
      flaggedCategories
    }
  });
});

// Doa & Dzikir List
app.get('/api/doa-dzikir', (req: Request, res: Response) => {
  res.json({ success: true, data: DOA_DZIKIR });
});

// Articles (Blog) endpoints
app.get('/api/articles', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let list = getArticles();
  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter(a => a.category === category);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      (a.tags || []).some((t: string) => t.toLowerCase().includes(q))
    );
  }
  list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  res.json({ success: true, total: list.length, data: list });
});

app.get('/api/articles/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const list = getArticles();
  const article = list.find(a => a.slug === slug || a.id === slug);
  if (!article) {
    return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
  }
  res.json({ success: true, data: article });
});

app.post('/api/articles', requireAdmin, (req: Request, res: Response) => {
  const { title, excerpt, content, category, author, coverImage, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Judul dan konten artikel wajib diisi' });
  }
  const articles = getArticles();
  const slug = (title as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
  const newArticle = {
    id: 'art-' + Date.now().toString(36),
    slug,
    title,
    excerpt: excerpt || (content as string).slice(0, 160),
    content,
    category: category || 'Umum',
    author: author || 'Ustadz Imam Syahrobani, M.Pd',
    coverImage: coverImage || '',
    publishedAt: new Date().toISOString(),
    tags: Array.isArray(tags) ? tags : [],
  };
  articles.unshift(newArticle);
  saveArticles(articles);
  res.status(201).json({ success: true, data: newArticle });
});

app.patch('/api/articles/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const articles = getArticles();
  const index = articles.findIndex(a => a.id === id || a.slug === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
  }
  const { title, excerpt, content, category, author, coverImage, tags } = req.body;
  if (title !== undefined) articles[index].title = title;
  if (excerpt !== undefined) articles[index].excerpt = excerpt;
  if (content !== undefined) articles[index].content = content;
  if (category !== undefined) articles[index].category = category;
  if (author !== undefined) articles[index].author = author;
  if (coverImage !== undefined) articles[index].coverImage = coverImage;
  if (tags !== undefined) articles[index].tags = tags;
  articles[index].updatedAt = new Date().toISOString();
  saveArticles(articles);
  res.json({ success: true, data: articles[index] });
});

app.delete('/api/articles/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const articles = getArticles();
  const filtered = articles.filter(a => a.id !== id && a.slug !== id);
  if (filtered.length === articles.length) {
    return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
  }
  saveArticles(filtered);
  res.json({ success: true, message: 'Artikel berhasil dihapus' });
});


// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Ruqyah Kuningan berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
