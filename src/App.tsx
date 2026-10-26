import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomTabBar } from './components/BottomTabBar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { BookingSection } from './components/BookingSection';
import { TrackingSection } from './components/TrackingSection';
import { QuizSection } from './components/QuizSection';
import { DoaDzikirSection } from './components/DoaDzikirSection';
import { EducationSection } from './components/EducationSection';
import { TherapistSection } from './components/TherapistSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { Service, Therapist, Appointment } from './types';
import { MessageSquare, PhoneCall } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  
  // Cross-component transition state
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);
  const [initialSymptomsForBooking, setInitialSymptomsForBooking] = useState<string | undefined>(undefined);

  // Initial data loading from Express backend
  useEffect(() => {
    // Fetch Services
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setServices(data.data);
      })
      .catch((err) => console.error('Failed to load services:', err));

    // Fetch Therapists
    fetch('/api/therapists')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setTherapists(data.data);
      })
      .catch((err) => console.error('Failed to load therapists:', err));

    // Fetch Kuningan Districts
    fetch('/api/districts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setDistricts(data.data);
      })
      .catch((err) => console.error('Failed to load districts:', err));
  }, []);

  const handleSelectServiceToBook = (serviceId: string) => {
    setSelectedServiceForBooking(serviceId);
    setActiveTab('jadwal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTherapistToBook = (therapistId: string) => {
    setActiveTab('jadwal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScheduleWithQuizResult = (symptomsText: string) => {
    setInitialSymptomsForBooking(symptomsText);
    setActiveTab('jadwal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracking={() => {
          setActiveTab('tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Router / Views */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activeTab === 'beranda' && (
          <>
            <HeroSection
              onStartBooking={() => {
                setActiveTab('jadwal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartQuiz={() => {
                setActiveTab('tes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreServices={() => {
                setActiveTab('layanan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Core Services Showcase */}
            <ServicesSection
              services={services}
              onSelectServiceToBook={handleSelectServiceToBook}
            />

            {/* Testimonials / Patient Success Stories */}
            <TestimonialsSection
              onScheduleService={handleSelectServiceToBook}
              onOpenBookingGeneral={() => {
                setActiveTab('jadwal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Syar'i Education & Thibbun Nabawi */}
            <EducationSection />

            {/* Certified Therapists & Clinic Location */}
            <TherapistSection
              therapists={therapists}
              onSelectTherapistToBook={handleSelectTherapistToBook}
            />
          </>
        )}

        {activeTab === 'layanan' && (
          <>
            <ServicesSection
              services={services}
              onSelectServiceToBook={handleSelectServiceToBook}
            />
            <EducationSection />
          </>
        )}

        {activeTab === 'jadwal' && (
          <BookingSection
            services={services}
            therapists={therapists}
            districts={districts}
            initialServiceId={selectedServiceForBooking}
            initialSymptoms={initialSymptomsForBooking}
            onOpenTracking={() => {
              setActiveTab('tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'tes' && (
          <QuizSection
            onScheduleWithQuizResult={handleScheduleWithQuizResult}
            onOpenDoa={() => {
              setActiveTab('doa');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'doa' && <DoaDzikirSection />}

        {activeTab === 'tracking' && (
          <TrackingSection
            onGoToBooking={() => {
              setActiveTab('jadwal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Floating Fast Consultation WhatsApp Action */}
      <aside aria-label="Konsultasi WhatsApp" className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30">
        <a
          href="https://wa.me/6283869262287?text=Assalamu'alaikum%20Ustadz%20Imam%20Syahrobani,%20saya%20ingin%20konsultasi%20jadwal%20terapi%20ruqyah"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-4 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 flex items-center gap-2 text-xs sm:text-sm font-semibold transition-transform active:scale-95"
          title="Konsultasi WhatsApp Admin: 0838-6926-2287"
        >
          <MessageSquare className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">WA Admin (0838-6926-2287)</span>
          <span className="sm:hidden">WA Admin</span>
        </a>
      </aside>

      {/* Mobile Bottom Tab Bar (thumb ergonomics) */}
      <BottomTabBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTracking={() => {
          setActiveTab('tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
