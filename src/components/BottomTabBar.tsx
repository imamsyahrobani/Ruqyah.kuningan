import React from 'react';
import { Home, Sparkles, CalendarCheck, HelpCircle, BookOpen } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'layanan', label: 'Layanan', icon: Sparkles },
    { id: 'jadwal', label: 'Jadwal', icon: CalendarCheck },
    { id: 'tes', label: 'Tes Gejala', icon: HelpCircle },
    { id: 'doa', label: 'Doa Syar’i', icon: BookOpen }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full min-h-[48px] flex flex-col items-center justify-center text-center transition-colors focus-visible:outline-none"
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'text-emerald-800 scale-110' : 'text-stone-400'
                }`}
              />
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 truncate max-w-[64px] ${
                  isActive ? 'text-emerald-950 font-semibold' : 'text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
