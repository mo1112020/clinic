
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnimalFormActionsProps {
  isSubmitting: boolean;
  isNewAnimal: boolean;
}

const AnimalFormActions: React.FC<AnimalFormActionsProps> = ({ isSubmitting, isNewAnimal }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="flex justify-end space-x-4"
    >
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate(-1)}
      >
        {t('cancel')}
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isNewAnimal ? t('registering') : t('updating')}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {isNewAnimal ? t('registerPatient') : t('updatePatient')}
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default AnimalFormActions;
