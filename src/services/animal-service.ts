
// Re-export everything from the refactored files
export { 
  createAnimal, 
  updateAnimal, 
  deleteAnimal, 
  getAnimalById,
  getCats
} from './animals';

// Use explicit type export to fix the TS1205 error
export type { AnimalFormData } from './animals';
