
import { AnimalType } from '@/types/database.types';

export interface AnimalFormData {
  animalType: AnimalType;
  name: string;
  breed: string;
  chipNumber?: string;
  ownerName: string;
  ownerId: string;
  ownerPhone: string;
  healthNotes?: string;
}
