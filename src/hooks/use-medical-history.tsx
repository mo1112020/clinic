
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchMedicalRecords } from '@/services/documents/fetch-documents';

export interface MedicalHistoryRecord {
  id: string;
  patientName: string;
  patientType: string;
  owner: string;
  date: string;
  procedure: string;
  details: string;
  veterinarian: string;
  animalId: string;
}

export function useMedicalHistory(animalType?: string, searchQuery?: string) {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadMedicalHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const records = await fetchMedicalRecords(animalType, searchQuery);
        
        // Transform the fetched records into the format expected by the UI
        const formattedData = records.map(record => ({
          id: record.id,
          patientName: record.animals?.name || 'Unknown',
          patientType: record.animals?.animal_type || 'Unknown',
          owner: record.animals?.owners?.full_name || 'Unknown',
          date: record.date,
          procedure: 'Medical Examination',
          details: record.description,
          veterinarian: 'Clinic Staff', // We don't have veterinarian data in the current schema
          animalId: record.animal_id
        }));

        setMedicalHistory(formattedData);
      } catch (err) {
        console.error('Error loading medical history:', err);
        setError('Failed to load medical history');
        toast({
          title: 'Error',
          description: 'Failed to load medical history. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMedicalHistory();
  }, [animalType, searchQuery, toast]);

  return { medicalHistory, isLoading, error };
}
