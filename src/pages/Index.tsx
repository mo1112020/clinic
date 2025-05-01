
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('welcomeMessage')}</h1>
        <p className="text-xl text-gray-600">{t('manageClinicOperations')}</p>
      </div>
    </div>
  );
};

export default Index;
