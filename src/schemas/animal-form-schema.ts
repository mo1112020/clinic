
import { z } from 'zod';
import { AnimalType } from '@/types/database.types';

// Animal form schema
export const animalFormSchema = z.object({
  animalType: z.enum(['cat', 'dog', 'bird'] as const),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  breed: z.string().min(2, 'Breed must be at least 2 characters'),
  chipNumber: z.string().optional(),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerId: z.string().min(2, 'Owner ID is required'),
  ownerPhone: z.string().min(8, 'Valid phone number is required'),
  healthNotes: z.string().optional(),
});

export type AnimalFormValues = z.infer<typeof animalFormSchema>;

export const defaultAnimalFormValues: AnimalFormValues = {
  animalType: 'dog',
  name: '',
  breed: '',
  chipNumber: '',
  ownerName: '',
  ownerId: '',
  ownerPhone: '',
  healthNotes: '',
};
