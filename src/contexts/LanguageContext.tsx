
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'tr';

type TranslationsType = {
  [key: string]: {
    en: string;
    tr: string;
  };
};

// Common translations used across the application
export const translations: TranslationsType = {
  dashboard: { en: 'Dashboard', tr: 'Panel' },
  newPatient: { en: 'New Patient', tr: 'Yeni Hasta' },
  searchRecords: { en: 'Search Records', tr: 'Kayıt Arama' },
  dogs: { en: 'Dogs', tr: 'Köpekler' },
  cats: { en: 'Cats', tr: 'Kediler' },
  birds: { en: 'Birds', tr: 'Kuşlar' },
  vaccinations: { en: 'Vaccinations', tr: 'Aşılar' },
  inventory: { en: 'Inventory', tr: 'Envanter' },
  records: { en: 'Records', tr: 'Kayıtlar' },
  medicalHistory: { en: 'Medical History', tr: 'Medikal Geçmiş' },
  logout: { en: 'Logout', tr: 'Çıkış' },
  // Add more translations as needed
  
  // Medical History page
  medicalRecords: { en: 'Medical Records', tr: 'Medikal Kayıtlar' },
  patient: { en: 'Patient', tr: 'Hasta' },
  owner: { en: 'Owner', tr: 'Sahip' },
  date: { en: 'Date', tr: 'Tarih' },
  procedure: { en: 'Procedure', tr: 'Prosedür' },
  details: { en: 'Details', tr: 'Detaylar' },
  veterinarian: { en: 'Veterinarian', tr: 'Veteriner' },
  patientDetails: { en: 'Patient Details', tr: 'Hasta Detayları' },
  
  // Vaccination page
  sendReminder: { en: 'Send Reminder', tr: 'Hatırlatma Gönder' },
  whatsappReminder: { en: 'WhatsApp Reminder', tr: 'WhatsApp Hatırlatma' },
  today: { en: 'Today', tr: 'Bugün' },
  upcoming: { en: 'Upcoming', tr: 'Yaklaşan' },
  overdue: { en: 'Overdue', tr: 'Gecikmiş' },
  all: { en: 'All', tr: 'Tümü' },
  opening: { en: 'Opening...', tr: 'Açılıyor...' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
