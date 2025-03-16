
import { Dog, Cat, Bird } from 'lucide-react';
import { AnimalType } from '@/types/database.types';

interface VaccinationAnimalIconProps {
  type: AnimalType;
  className?: string;
}

export const VaccinationAnimalIcon = ({ type, className = "h-5 w-5" }: VaccinationAnimalIconProps) => {
  switch (type) {
    case 'dog':
      return <Dog className={`${className} text-amber-500`} />;
    case 'cat':
      return <Cat className={`${className} text-green-500`} />;
    case 'bird':
      return <Bird className={`${className} text-purple-500`} />;
    default:
      return null;
  }
};
