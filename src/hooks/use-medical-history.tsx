
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
        // We're now only processing records with valid animal and owner data
        // This is guaranteed by the inner join in the SQL query
        const formattedData = records
          .filter(record => record.animals && record.animals.name && record.animals.owners)
          .map(record => ({
            id: record.id,
            patientName: record.animals.name,
            patientType: record.animals.animal_type,
            owner: record.animals.owners.full_name,
            date: record.date,
            procedure: 'Medical Examination',
            details: record.description,
            veterinarian: 'Clinic Staff', // Default value
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalType, searchQuery]);

  return { medicalHistory, isLoading, error };
}
