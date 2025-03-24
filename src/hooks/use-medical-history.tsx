
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useMedicalHistory(animalType?: string, searchQuery?: string) {
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This is a placeholder - in a real app, you would fetch from a medical_history table
        // Since we don't have that table, we'll use vaccinations as an example
        let query = supabase
          .from('vaccinations')
          .select(`
            *,
            animals (
              id,
              name,
              animal_type,
              owners (
                full_name
              )
            )
          `);

        if (animalType && animalType !== 'all') {
          query = query.eq('animals.animal_type', animalType);
        }

        if (searchQuery) {
          query = query.or(
            `animals.name.ilike.%${searchQuery}%,animals.owners.full_name.ilike.%${searchQuery}%,vaccine_name.ilike.%${searchQuery}%`
          );
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data for the medical history format
        const formattedData = data.map(item => ({
          id: item.id,
          patientName: item.animals.name,
          patientType: item.animals.animal_type,
          owner: item.animals.owners.full_name,
          date: item.scheduled_date,
          procedure: item.completed ? 'Vaccination (Completed)' : 'Vaccination (Scheduled)',
          details: `${item.vaccine_name} vaccination`,
          veterinarian: 'Dr. Sarah Johnson' // This would come from a staff/users table in a real app
        }));

        setMedicalHistory(formattedData);
      } catch (err) {
        console.error('Error fetching medical history:', err);
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

    fetchMedicalHistory();
  }, [animalType, searchQuery, toast]);

  return { medicalHistory, isLoading, error };
}
