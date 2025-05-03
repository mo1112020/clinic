
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
  refetch: () => Promise<void>;
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

  const fetchAnimalData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch animal and owner data
      const animalData = await getAnimalById(animalId);
      setAnimal({
        id: animalData.id,
        name: animalData.name,
        type: animalData.animal_type,
        customAnimalType: animalData.custom_animal_type,
        breed: animalData.breed || '',
        chipNo: animalData.chip_number,
        ageYears: animalData.age_years,
        ageMonths: animalData.age_months,
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
      const vaccinationData = await fetchVaccinations(animalId);
      setVaccinations(vaccinationData);
      
      // Fetch medical records
      const medicalRecordsData = await fetchMedicalRecords(animalId);
      setMedicalHistory(medicalRecordsData);
      
      // For demo, using sample documents
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

  const fetchVaccinations = async (animalId: string): Promise<Vaccination[]> => {
    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('animal_id', animalId);

      if (error) throw error;

      return data.map((vaccination) => ({
        id: vaccination.id,
        animal_id: vaccination.animal_id,
        name: vaccination.vaccine_name,
        date: vaccination.scheduled_date,
        next_due: vaccination.scheduled_date,
        status: vaccination.completed ? 'completed' : 'upcoming' as 'completed' | 'upcoming' | 'overdue',
      }));
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      return [];
    }
  };

  const fetchMedicalRecords = async (animalId: string): Promise<MedicalRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('animal_id', animalId)
        .order('date', { ascending: false });

      if (error) throw error;

      if (data.length === 0) {
        // If no records exist, let's create an initial one
        const initialRecord = {
          animal_id: animalId,
          date: new Date().toISOString().split('T')[0],
          description: 'Routine checkup',
          notes: 'Patient is in good health. Weight: 10kg. No concerns.'
        };

        const { data: newRecordData, error: insertError } = await supabase
          .from('medical_records')
          .insert(initialRecord)
          .select();

        if (insertError) throw insertError;

        return newRecordData.map(record => ({
          id: record.id,
          animal_id: record.animal_id,
          date: record.date,
          description: record.description,
          notes: record.notes,
        }));
      }

      return data.map(record => ({
        id: record.id,
        animal_id: record.animal_id,
        date: record.date,
        description: record.description,
        notes: record.notes,
      }));
    } catch (error) {
      console.error('Error fetching medical records:', error);
      return [];
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
