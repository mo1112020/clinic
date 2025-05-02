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
  
  // Additional translations for Medical History page
  viewAndSearchRecords: { en: 'View and search medical records', tr: 'Medikal kayıtları görüntüle ve ara' },
  searchPlaceholder: { en: 'Search by patient name, owner...', tr: 'Hasta adı, sahip bilgisi ile ara...' },
  search: { en: 'Search', tr: 'Ara' },
  loadingRecords: { en: 'Loading records...', tr: 'Kayıtlar yükleniyor...' },
  noRecordsFound: { en: 'No medical records found', tr: 'Medikal kayıt bulunamadı' },
  
  // Dashboard page
  manageClinicOperations: { en: 'Manage your veterinary clinic operations.', tr: 'Veteriner kliniği operasyonlarınızı yönetin.' },
  totalPatients: { en: 'Total Patients', tr: 'Toplam Hasta' },
  addNewPatient: { en: 'Add New Patient', tr: 'Yeni Hasta Ekle' },
  registerNewAnimal: { en: 'Register a new animal', tr: 'Yeni hayvan kaydı' },
  upcomingVaccinations: { en: 'Upcoming Vaccinations', tr: 'Yaklaşan Aşılar' },
  viewScheduledReminders: { en: 'View scheduled reminders', tr: 'Planlanmış hatırlatıcıları görüntüle' },
  inventoryManagement: { en: 'Inventory Management', tr: 'Envanter Yönetimi' },
  checkStockLevels: { en: 'Check stock levels', tr: 'Stok seviyelerini kontrol et' },
  recentActivity: { en: 'Recent Activity', tr: 'Son Aktivite' },
  viewLatestActivity: { en: 'View latest clinic activity', tr: 'En son klinik aktivitelerini görüntüle' },
  quickActions: { en: 'Quick Actions', tr: 'Hızlı İşlemler' },
  recentPatients: { en: 'Recent Patients', tr: 'Son Hastalar' },
  latestVisits: { en: 'Latest Visits', tr: 'Son Ziyaretler' },
  noRecentPatients: { en: 'No recent patients found', tr: 'Son hasta bulunamadı' },
  loadingDashboard: { en: 'Loading dashboard data...', tr: 'Panel verileri yükleniyor...' },
  errorLoadingDashboard: { en: 'Error Loading Dashboard', tr: 'Panel Yüklenirken Hata' },
  failedToLoad: { en: 'Failed to load dashboard data', tr: 'Panel verileri yüklenemedi' },
  
  // Animal details page
  editDetails: { en: 'Edit Details', tr: 'Detayları Düzenle' },
  delete: { en: 'Delete', tr: 'Sil' },
  deletePatient: { en: 'Delete Patient Record', tr: 'Hasta Kaydını Sil' },
  deleteWarning: { en: 'This will permanently delete the patient record from the system. This action cannot be undone.', tr: 'Bu, hasta kaydını sistemden kalıcı olarak silecektir. Bu işlem geri alınamaz.' },
  cancel: { en: 'Cancel', tr: 'İptal' },
  deleting: { en: 'Deleting...', tr: 'Siliniyor...' },
  ownerInformation: { en: 'Owner Information', tr: 'Sahip Bilgileri' },
  ownerName: { en: 'Owner Name', tr: 'Sahip Adı' },
  idNumber: { en: 'ID Number', tr: 'Kimlik Numarası' },
  contactPhone: { en: 'Contact Phone', tr: 'İletişim Telefonu' },
  email: { en: 'Email', tr: 'E-posta' },
  
  // Tabs
  vaccinationsTab: { en: 'Vaccinations', tr: 'Aşılar' },
  medicalHistoryTab: { en: 'Medical History', tr: 'Medikal Geçmiş' },
  documentsTab: { en: 'Documents', tr: 'Belgeler' },
  
  // Login page
  login: { en: 'Login', tr: 'Giriş' },
  username: { en: 'Username', tr: 'Kullanıcı Adı' },
  password: { en: 'Password', tr: 'Şifre' },
  signIn: { en: 'Sign In', tr: 'Oturum Aç' },
  signingIn: { en: 'Signing in...', tr: 'Oturum açılıyor...' },
  loginSuccessful: { en: 'Login successful', tr: 'Giriş başarılı' },
  welcomeMessage: { en: 'Welcome to Canki-Klinik', tr: 'Canki-Klinik\'e Hoş Geldiniz' },
  loginFailed: { en: 'Login failed', tr: 'Giriş başarısız' },
  invalidCredentials: { en: 'Invalid username or password', tr: 'Geçersiz kullanıcı adı veya şifre' },
  veterinaryManagement: { en: 'Veterinary Management System', tr: 'Veteriner Yönetim Sistemi' },
  
  // New Patient Form
  registerNewPatient: { en: 'Register New Patient', tr: 'Yeni Hasta Kaydı' },
  addNewAnimal: { en: 'Add a new animal to the system', tr: 'Sisteme yeni hayvan ekle' },
  editPatient: { en: 'Edit Patient', tr: 'Hastayı Düzenle' },
  updateAnimalInfo: { en: 'Update the animal information', tr: 'Hayvan bilgilerini güncelle' },
  loadingAnimalData: { en: 'Loading animal data...', tr: 'Hayvan verileri yükleniyor...' },
  
  // Animal Information Form
  animalInformation: { en: 'Animal Information', tr: 'Hayvan Bilgileri' },
  animalName: { en: 'Name', tr: 'İsim' },
  animalType: { en: 'Animal Type', tr: 'Hayvan Türü' },
  breed: { en: 'Breed', tr: 'Irk' },
  chipNumber: { en: 'Chip Number', tr: 'Çip Numarası' },
  healthNotes: { en: 'Health Notes', tr: 'Sağlık Notları' },
  proneDiseases: { en: 'Prone Diseases', tr: 'Yatkın Hastalıklar' },
  
  // SearchRecords Page
  findPatientRecords: { en: 'Find patient records quickly by name, chip number, or owner.', tr: 'İsim, çip numarası veya sahibine göre hasta kayıtlarını hızlıca bulun.' },
  searchPatients: { en: 'Search Patients', tr: 'Hasta Ara' },
  enterPatientInfo: { en: 'Enter the patient information to search', tr: 'Arama için hasta bilgilerini girin' },
  byName: { en: 'By Name', tr: 'İsme Göre' },
  byChip: { en: 'By Chip No.', tr: 'Çip No\'ya Göre' },
  byOwner: { en: 'By Owner', tr: 'Sahibine Göre' },
  searchResults: { en: 'Search Results', tr: 'Arama Sonuçları' },
  found: { en: 'Found', tr: 'Bulundu' },
  result: { en: 'result', tr: 'sonuç' },
  results: { en: 'results', tr: 'sonuç' },
  loadingAnimals: { en: 'Loading animals...', tr: 'Hayvanlar yükleniyor...' },
  noResultsFound: { en: 'No results found. Try a different search.', tr: 'Sonuç bulunamadı. Farklı bir arama deneyin.' },
  
  // Dogs, Cats, Birds Pages
  dogsRegistry: { en: 'Dogs Registry', tr: 'Köpek Kayıtları' },
  catsRegistry: { en: 'Cats Registry', tr: 'Kedi Kayıtları' },
  birdsRegistry: { en: 'Birds Registry', tr: 'Kuş Kayıtları' },
  registeredDogs: { en: 'List of all registered dogs at Canki Vet Clinic.', tr: 'Canki Veteriner Kliniğindeki tüm kayıtlı köpekler.' },
  registeredCats: { en: 'List of all registered cats at Canki Vet Clinic.', tr: 'Canki Veteriner Kliniğindeki tüm kayıtlı kediler.' },
  registeredBirds: { en: 'List of all registered birds at Canki Vet Clinic.', tr: 'Canki Veteriner Kliniğindeki tüm kayıtlı kuşlar.' },
  searchDogs: { en: 'Search Dogs', tr: 'Köpek Ara' },
  searchCats: { en: 'Search Cats', tr: 'Kedi Ara' },
  searchBirds: { en: 'Search Birds', tr: 'Kuş Ara' },
  searchByNameBreed: { en: 'Search by name, breed, chip number, or owner', tr: 'İsim, ırk, çip numarası veya sahibine göre ara' },
  noDogs: { en: 'No dogs found. Try a different search.', tr: 'Köpek bulunamadı. Farklı bir arama deneyin.' },
  noCats: { en: 'No cats found. Try a different search.', tr: 'Kedi bulunamadı. Farklı bir arama deneyin.' },
  noBirds: { en: 'No birds found. Try a different search.', tr: 'Kuş bulunamadı. Farklı bir arama deneyin.' },
  loadingDogs: { en: 'Loading dogs...', tr: 'Köpekler yükleniyor...' },
  loadingCats: { en: 'Loading cats...', tr: 'Kediler yükleniyor...' },
  loadingBirds: { en: 'Loading birds...', tr: 'Kuşlar yükleniyor...' },
  errorDogs: { en: 'Error loading dogs:', tr: 'Köpekler yüklenirken hata:' },
  errorCats: { en: 'Error loading cats:', tr: 'Kediler yüklenirken hata:' },
  errorBirds: { en: 'Error loading birds:', tr: 'Kuşlar yüklenirken hata:' },
  name: { en: 'Name', tr: 'İsim' },
  chipNo: { en: 'Chip No.', tr: 'Çip No.' },
  lastVisit: { en: 'Last Visit', tr: 'Son Ziyaret' },
  contact: { en: 'Contact', tr: 'İletişim' },
  view: { en: 'View', tr: 'Görüntüle' },
  refresh: { en: 'Refresh', tr: 'Yenile' },
  loading: { en: 'Loading...', tr: 'Yükleniyor...' },
  createNew: { en: 'Create New', tr: 'Yeni Oluştur' },
  
  // Inventory Management
  manageStock: { en: 'Manage your clinic\'s stock and supplies.', tr: 'Kliniğinizin stok ve malzemelerini yönetin.' },
  inventoryItems: { en: 'Inventory Items', tr: 'Envanter Öğeleri' },
  manageStockAndSupplies: { en: 'Manage your clinic\'s stock and supplies', tr: 'Kliniğinizin stok ve malzemelerini yönetin' },
  loadingItems: { en: 'Loading items...', tr: 'Öğeler yükleniyor...' },
  showing: { en: 'Showing', tr: 'Gösteriliyor' },
  item: { en: 'item', tr: 'öğe' },
  items: { en: 'items', tr: 'öğe' },
  productName: { en: 'Product Name', tr: 'Ürün Adı' },
  quantity: { en: 'Quantity', tr: 'Miktar' },
  price: { en: 'Price', tr: 'Fiyat' },
  status: { en: 'Status', tr: 'Durum' },
  actions: { en: 'Actions', tr: 'İşlemler' },
  edit: { en: 'Edit', tr: 'Düzenle' },
  save: { en: 'Save', tr: 'Kaydet' },
  saving: { en: 'Saving...', tr: 'Kaydediliyor...' },
  addItem: { en: 'Add Item', tr: 'Öğe Ekle' },
  
  // Additional translations for the animal form
  success: { en: 'Success', tr: 'Başarılı' },
  error: { en: 'Error', tr: 'Hata' },
  animalCreatedSuccessfully: { en: 'Animal registered successfully', tr: 'Hayvan başarıyla kaydedildi' },
  animalUpdatedSuccessfully: { en: 'Animal updated successfully', tr: 'Hayvan başarıyla güncellendi' },
  failedToSaveAnimal: { en: 'Failed to save animal', tr: 'Hayvan kaydedilemedi' },
  chipNumberAlreadyExists: { en: 'An animal with this chip number already exists', tr: 'Bu çip numarasına sahip bir hayvan zaten mevcut' },
  failedToLoadAnimalData: { en: 'Failed to load animal data', tr: 'Hayvan verisi yüklenemedi' },
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
