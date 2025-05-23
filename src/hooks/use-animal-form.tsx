
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getAnimalById, createAnimal, updateAnimal } from '@/services/animals';
import { animalFormSchema, AnimalFormValues, defaultAnimalFormValues } from '@/schemas/animal-form-schema';
import { AnimalType } from '@/types/database.types';
import { useLanguage } from '@/contexts/LanguageContext';

export function useAnimalForm(animalId?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNewAnimal = !animalId;
  
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: defaultAnimalFormValues,
    mode: 'onChange', // Enable validation as the user types
  });
  
  useEffect(() => {
    if (!isNewAnimal) {
      const fetchAnimal = async () => {
        setIsLoading(true);
        try {
          const animal = await getAnimalById(animalId!);
          
          // Handle phone number with country code
          let phoneNumber = animal.owner.phone_number || '';
          let countryCode = '+90'; // Default
          
          // Try to extract country code if present
          const phoneMatch = phoneNumber.match(/^(\+\d+)\s*(.*)$/);
          if (phoneMatch) {
            countryCode = phoneMatch[1];
            phoneNumber = phoneMatch[2];
          }
          
          // Determine if this is a custom animal type
          let animalType: AnimalType = animal.animal_type as AnimalType;
          let customAnimalType = '';
          
          if (animalType === 'other' && animal.custom_animal_type) {
            customAnimalType = animal.custom_animal_type;
          }

          // Parse age information - use direct age_years and age_months from db
          const ageYears = animal.age_years;
          const ageMonths = animal.age_months;
          
          console.log('Loading animal with age data:', { ageYears, ageMonths });
          
          form.reset({
            animalType: animalType,
            customAnimalType: customAnimalType,
            name: animal.name,
            breed: animal.breed || '',
            chipNumber: animal.chip_number || '',
            ageYears: ageYears,
            ageMonths: ageMonths,
            ownerName: animal.owner.full_name,
            ownerId: animal.owner.id_number,
            ownerPhoneCountryCode: countryCode,
            ownerPhone: phoneNumber,
            healthNotes: animal.prone_diseases ? animal.prone_diseases.join(', ') : '',
          });
        } catch (error) {
          console.error('Error fetching animal:', error);
          toast({
            title: t('error'),
            description: t('failedToLoadAnimalData'),
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAnimal();
    }
  }, [animalId, isNewAnimal, form, toast, t]);
  
  const onSubmit = async (data: AnimalFormValues) => {
    console.log('onSubmit called in useAnimalForm with data:', data);
    setIsSubmitting(true);
    
    try {
      // Combine country code with phone number
      const fullPhoneNumber = `${data.ownerPhoneCountryCode} ${data.ownerPhone}`;
      
      // Log age values to debug
      console.log('Form age values:', { 
        ageYears: data.ageYears, 
        ageMonths: data.ageMonths,
        typeYears: typeof data.ageYears,
        typeMonths: typeof data.ageMonths
      });
      
      const animalData = {
        animalType: data.animalType,
        customAnimalType: data.animalType === 'other' ? data.customAnimalType : undefined,
        name: data.name,
        breed: data.breed,
        chipNumber: data.chipNumber,
        // Pass the raw age values directly, not as a formatted string
        ageYears: data.ageYears,
        ageMonths: data.ageMonths,
        ownerName: data.ownerName,
        ownerId: data.ownerId,
        ownerPhone: fullPhoneNumber,
        healthNotes: data.healthNotes,
      };
      
      console.log('Prepared animal data for submission:', animalData);
      
      let result;
      
      if (isNewAnimal) {
        result = await createAnimal(animalData);
        console.log('Create animal result:', result);
        
        toast({
          title: t('success'),
          description: t('animalCreatedSuccessfully'),
        });
      } else {
        result = await updateAnimal(animalId!, animalData);
        console.log('Update animal result:', result);
        
        toast({
          title: t('success'),
          description: t('animalUpdatedSuccessfully'),
        });
      }
      
      // Navigate only after successful submission
      navigate('/animals/search');
    } catch (error: any) {
      console.error('Error saving animal:', error);
      
      // More detailed error handling
      let errorMessage = t('failedToSaveAnimal');
      
      if (error?.message?.includes('chip_number')) {
        errorMessage = t('chipNumberAlreadyExists');
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Don't navigate on error
      throw error; // Re-throw to be caught by the form's error handler
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isLoading,
    isSubmitting,
    isNewAnimal,
    onSubmit,
  };
}
