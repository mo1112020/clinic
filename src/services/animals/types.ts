
import { AnimalType } from '@/types/database.types';

export interface AnimalFormData {
  animalType: AnimalType;
  customAnimalType?: string;
  name: string;
  breed: string;
  chipNumber?: string;
  ownerName: string;
  ownerId: string;
  ownerPhone: string;
  healthNotes?: string;
  ageYears?: number;
  ageMonths?: number;
}
