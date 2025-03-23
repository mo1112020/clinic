
import { useState, useEffect } from 'react';
import { Animal, Owner, Vaccination, MedicalRecord, Document } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';
import { getAnimalById } from '@/services/animals';
import { supabase } from '@/integrations/supabase/client';

interface UseAnimalDetailsResult {
  animal: Animal | null;
  owner: Owner | null;
  vaccinations: Vaccination[];
  medicalHistory: MedicalRecord[];
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnimalDetails(animalId: string): UseAnimalDetailsResult {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnimalData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch animal and owner data
      const animalData = await getAnimalById(animalId);
      setAnimal({
        id: animalData.id,
        name: animalData.name,
        type: animalData.animal_type,
        breed: animalData.breed || '',
        chipNo: animalData.chip_number,
        healthNotes: animalData.prone_diseases ? animalData.prone_diseases.join(', ') : '',
        owner_id: animalData.owner_id,
        created_at: animalData.created_at
      });
      
      setOwner({
        id: animalData.owner.id,
        name: animalData.owner.full_name,
        phone: animalData.owner.phone_number,
        email: '',
        id_number: animalData.owner.id_number
      });
      
      // Fetch vaccinations
      const { data: vaccinationData, error: vaccinationError } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('animal_id', animalId);
      
      if (vaccinationError) throw vaccinationError;
      
      setVaccinations(vaccinationData.map(v => ({
        id: v.id,
        animal_id: v.animal_id,
        name: v.vaccine_name,
        date: v.scheduled_date,
        next_due: v.scheduled_date, // Using same date for demo
        status: v.completed ? 'completed' : 'upcoming',
      })));
      
      // For demo, using sample medical history and documents
      setMedicalHistory([
        {
          id: '1',
          animal_id: animalId,
          date: new Date().toISOString(),
          description: 'Routine checkup',
          notes: 'Patient is in good health. Weight: 10kg. No concerns.',
        },
      ]);
      
      setDocuments([
        {
          id: '1',
          animal_id: animalId,
          name: 'Initial Examination Report',
          date: new Date().toISOString(),
          type: 'PDF',
          size: '120 KB',
          url: '#'
        },
      ]);
      
    } catch (err) {
      console.error('Error fetching animal details:', err);
      setError('Failed to load animal details');
      toast({
        title: 'Error',
        description: 'Failed to load animal details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimalData();
  }, [animalId, toast]);

  return {
    animal,
    owner,
    vaccinations,
    medicalHistory,
    documents,
    isLoading,
    error,
    refetch: fetchAnimalData
  };
}
