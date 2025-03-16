
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Animal, Vaccination, MedicalRecord, Document } from '@/types/database.types';
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

        setAnimal(animalData as unknown as Animal);
        setOwner(animalData.owners);

        // Fetch vaccinations
        const { data: vaccinationData, error: vaccinationError } = await supabase
          .from('vaccinations')
          .select('*')
          .eq('animal_id', animalId);

        if (vaccinationError) throw vaccinationError;
        setVaccinations(vaccinationData as Vaccination[]);

        // Fetch medical history
        const { data: medicalData, error: medicalError } = await supabase
          .from('medical_records')
          .select('*')
          .eq('animal_id', animalId)
          .order('date', { ascending: false });

        if (medicalError) throw medicalError;
        setMedicalHistory(medicalData as MedicalRecord[]);

        // Fetch documents
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .select('*')
          .eq('animal_id', animalId);

        if (documentError) throw documentError;
        setDocuments(documentData as Document[]);

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
