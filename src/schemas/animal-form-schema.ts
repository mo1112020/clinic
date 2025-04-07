
import { z } from 'zod';
import { AnimalType } from '@/types/database.types';

// Animal form schema
export const animalFormSchema = z.object({
  animalType: z.enum(['cat', 'dog', 'bird', 'other'] as const),
  customAnimalType: z.string().optional()
    .refine(val => val !== undefined && val.trim() !== '' || val === undefined, {
      message: 'Animal type is required when Other is selected',
    }),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  breed: z.string().min(2, 'Breed must be at least 2 characters'),
  chipNumber: z.string().optional(),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerId: z.string().min(2, 'Owner ID is required'),
  ownerPhoneCountryCode: z.string().default('+90'),
  ownerPhone: z.string().min(5, 'Valid phone number is required'),
  healthNotes: z.string().optional(),
}).refine((data) => {
  // If animalType is 'other', customAnimalType must be provided
  if (data.animalType === 'other') {
    return !!data.customAnimalType && data.customAnimalType.trim() !== '';
  }
  return true;
}, {
  message: 'Please specify the animal type',
  path: ['customAnimalType'],
});

export type AnimalFormValues = z.infer<typeof animalFormSchema>;

export const defaultAnimalFormValues: AnimalFormValues = {
  animalType: 'dog',
  customAnimalType: '',
  name: '',
  breed: '',
  chipNumber: '',
  ownerName: '',
  ownerId: '',
  ownerPhoneCountryCode: '+90',
  ownerPhone: '',
  healthNotes: '',
};
