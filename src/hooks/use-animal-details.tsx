
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Animal, Vaccination, MedicalRecord, Document, AnimalType } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';

export function useAnimalDetails(animalId: string) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnimalDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch animal with owner
        const { data: animalData, error: animalError } = await supabase
          .from('animals')
          .select(`
            *,
            owners(*)
          `)
          .eq('id', animalId)
          .single();

        if (animalError) throw animalError;

        // Map database animal to application Animal type
        const mappedAnimal: Animal = {
          id: animalData.id,
          name: animalData.name,
          type: animalData.animal_type as AnimalType, // Explicitly cast to AnimalType
          breed: animalData.breed || '',
          chipNo: animalData.chip_number || '',
          healthNotes: animalData.prone_diseases ? animalData.prone_diseases.join(', ') : '',
          owner_id: animalData.owner_id,
          created_at: animalData.created_at,
          owners: animalData.owners,
        };
        
        setAnimal(mappedAnimal);
        setOwner({
          id: animalData.owners.id,
          name: animalData.owners.full_name,
          phone: animalData.owners.phone_number,
          id_number: animalData.owners.id_number
        });

        // Fetch vaccinations
        const { data: vaccinationData, error: vaccinationError } = await supabase
          .from('vaccinations')
          .select('*')
          .eq('animal_id', animalId);

        if (vaccinationError) throw vaccinationError;
        
        // Map database vaccinations to application Vaccination type
        const mappedVaccinations: Vaccination[] = vaccinationData.map(vax => ({
          id: vax.id,
          animal_id: vax.animal_id,
          name: vax.vaccine_name,
          date: vax.scheduled_date,
          next_due: vax.scheduled_date, // Using the same date for demo
          status: vax.completed ? 'completed' : 'upcoming'
        }));
        
        setVaccinations(mappedVaccinations);

        // For medical history, using the vaccinations for demonstration
        // In a real app, we would fetch from a medical_records table
        const mappedMedicalHistory: MedicalRecord[] = vaccinationData.map(vax => ({
          id: vax.id,
          animal_id: vax.animal_id,
          date: vax.scheduled_date,
          description: `Vaccination: ${vax.vaccine_name}`,
          notes: vax.completed ? 'Completed' : 'Scheduled'
        }));
        
        setMedicalHistory(mappedMedicalHistory);

        // Fetch documents (using medical_files table)
        const { data: documentData, error: documentError } = await supabase
          .from('medical_files')
          .select('*')
          .eq('animal_id', animalId);

        if (documentError) throw documentError;
        
        // Map database medical_files to application Document type
        const mappedDocuments: Document[] = documentData.map(doc => ({
          id: doc.id,
          animal_id: doc.animal_id,
          name: doc.file_name,
          date: doc.uploaded_at,
          type: doc.file_type,
          size: '1.2 MB', // Placeholder since we don't store size
          url: doc.file_url
        }));
        
        setDocuments(mappedDocuments);

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

    if (animalId) {
      fetchAnimalDetails();
    }
  }, [animalId, toast]);

  return { animal, owner, vaccinations, medicalHistory, documents, isLoading, error };
}
