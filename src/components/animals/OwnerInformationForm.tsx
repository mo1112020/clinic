
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AnimalFormValues } from '@/schemas/animal-form-schema';
import { motion } from 'framer-motion';
import { CountryCodeSelector, Country } from '@/components/ui/country-code-selector';
import { useLanguage } from '@/contexts/LanguageContext';

interface OwnerInformationFormProps {
  form: UseFormReturn<AnimalFormValues>;
}

const OwnerInformationForm: React.FC<OwnerInformationFormProps> = ({ form }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium">{t('ownerInformation')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ownerName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enterOwnerName')} {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ownerIdNumber')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enterOwnerId')} {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="ownerPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('ownerPhoneNumber')}</FormLabel>
            <div className="flex">
              <FormField
                control={form.control}
                name="ownerPhoneCountryCode"
                render={({ field: countryCodeField }) => (
                  <CountryCodeSelector 
                    value={countryCodeField.value} 
                    onChange={(country: Country) => {
                      countryCodeField.onChange(country.dialCode);
                    }}
                    className="rounded-r-none border-r-0"
                  />
                )}
              />
              <FormControl>
                <Input 
                  placeholder={t('enterPhoneNumber')}
                  {...field} 
                  className="glass-input rounded-l-none flex-1" 
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

export default OwnerInformationForm;
