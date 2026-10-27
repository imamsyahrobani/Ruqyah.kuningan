export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  duration: string;
  target: string;
  includes: string[];
  infak: string;
  recommendedFor: string;
}

export interface Therapist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  gender: string;
  experience: string;
  education: string;
  scheduleDays: string[];
  availableSlots: string[];
  bio: string;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  patientName: string;
  phone: string;
  gender: string;
  age?: number;
  district: string;
  address: string;
  serviceId: string;
  serviceTitle: string;
  therapistId: string;
  therapistName: string;
  date: string;
  slot: string;
  symptoms: string;
  symptomCategory: string;
  status: 'menunggu_konfirmasi' | 'dikonfirmasi' | 'selesai' | 'dibatalkan';
  therapistNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SlotAvailability {
  time: string;
  isAvailable: boolean;
  bookedCount: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  weight: number;
}

export interface QuizResult {
  score: number;
  maxScore: number;
  severity: string;
  advice: string;
  needPersonalTherapy: boolean;
  flaggedCategories: Record<string, number>;
}

export interface DoaItem {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  benefit: string;
  audioUrl?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  role: string;
  district: string;
  serviceType: string;
  therapist: string;
  beforeCondition: string;
  afterCondition: string;
  quote: string;
  category: 'medis_fisik' | 'psikis_waswas' | 'homecare' | 'usaha';
  date: string;
  verifiedBooking: boolean;
}

