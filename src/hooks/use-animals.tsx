
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Animal, AnimalType } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';

export function useAnimals(type?: AnimalType, searchQuery?: string) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase.from('animals').select(`
          *,
          owners(id, full_name, phone_number, id_number)
        `);

        if (type) {
          query = query.eq('animal_type', type);
        }

        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,breed.ilike.%${searchQuery}%,chip_number.ilike.%${searchQuery}%,owners.full_name.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        setAnimals(data as unknown as Animal[]);
      } catch (err) {
        console.error('Error fetching animals:', err);
        setError('Failed to load animals');
        toast({
          title: 'Error',
          description: 'Failed to load animals. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, [type, searchQuery, toast]);

  return { animals, isLoading, error };
}
