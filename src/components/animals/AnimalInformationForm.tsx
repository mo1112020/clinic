
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AnimalFormValues } from '@/schemas/animal-form-schema';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnimalInformationFormProps {
  form: UseFormReturn<AnimalFormValues>;
}

const AnimalInformationForm: React.FC<AnimalInformationFormProps> = ({ form }) => {
  const animalType = form.watch('animalType');
  const showCustomAnimalTypeField = animalType === 'other';
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium">{t('animalInformation')}</h3>
      
      <FormField
        control={form.control}
        name="animalType"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>{t('animalType')}</FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-wrap gap-4"
            >
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="dog" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">{t('dog')}</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="cat" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">{t('cat')}</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="bird" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">{t('bird')}</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="other" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">{t('other')}</FormLabel>
              </FormItem>
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {showCustomAnimalTypeField && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FormField
            control={form.control}
            name="customAnimalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('specifyAnimalType')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('animalTypeExamples')}
                    {...field} 
                    className="glass-input" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('animalName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enterAnimalName')} {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('breed')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enterBreed')} {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="chipNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('microchipNumber')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterMicrochipNumber')} {...field} className="glass-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="healthNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('healthNotes')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterHealthNotes')}
                className="glass-input min-h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

export default AnimalInformationForm;
