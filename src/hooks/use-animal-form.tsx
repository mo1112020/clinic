
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getAnimalById, createAnimal, updateAnimal } from '@/services/animal-service';
import { animalFormSchema, AnimalFormValues, defaultAnimalFormValues } from '@/schemas/animal-form-schema';
import { AnimalType } from '@/types/database.types';

export function useAnimalForm(animalId?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNewAnimal = !animalId;
  
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: defaultAnimalFormValues,
  });
  
  // Fetch animal data if editing
  useEffect(() => {
    if (!isNewAnimal) {
      const fetchAnimal = async () => {
        setIsLoading(true);
        try {
          const animal = await getAnimalById(animalId!);
          
          form.reset({
            animalType: animal.animal_type as AnimalType,
            name: animal.name,
            breed: animal.breed || '',
            chipNumber: animal.chip_number || '',
            ownerName: animal.owner.full_name,
            ownerId: animal.owner.id_number,
            ownerPhone: animal.owner.phone_number,
            healthNotes: animal.prone_diseases ? animal.prone_diseases.join(', ') : '',
          });
        } catch (error) {
          console.error('Error fetching animal:', error);
          toast({
            title: 'Error',
            description: 'Failed to load animal data.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAnimal();
    }
  }, [animalId, isNewAnimal, form, toast]);
  
  const onSubmit = async (data: AnimalFormValues) => {
    console.log('Submitting form with data:', data);
    setIsSubmitting(true);
    try {
      if (isNewAnimal) {
        const result = await createAnimal({
          animalType: data.animalType,
          name: data.name,
          breed: data.breed,
          chipNumber: data.chipNumber,
          ownerName: data.ownerName,
          ownerId: data.ownerId,
          ownerPhone: data.ownerPhone,
          healthNotes: data.healthNotes,
        });
        
        console.log('Create animal result:', result);
        
        toast({
          title: 'Animal created successfully',
          description: `${data.name} has been added to the system.`,
        });
      } else {
        const result = await updateAnimal(animalId!, {
          animalType: data.animalType,
          name: data.name,
          breed: data.breed,
          chipNumber: data.chipNumber,
          ownerName: data.ownerName,
          ownerId: data.ownerId,
          ownerPhone: data.ownerPhone,
          healthNotes: data.healthNotes,
        });
        
        console.log('Update animal result:', result);
        
        toast({
          title: 'Animal updated successfully',
          description: `${data.name} has been updated in the system.`,
        });
      }
      
      // Navigate to the appropriate page
      navigate('/animals/search');
    } catch (error) {
      console.error('Error saving animal:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isNewAnimal ? 'create' : 'update'} animal. Please try again.`,
        variant: 'destructive',
      });
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
