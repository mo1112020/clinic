
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Animal, AnimalType } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';

export function useAnimals(type?: AnimalType, searchQuery?: string, searchBy: string = 'name') {
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

        if (searchQuery && searchQuery.trim() !== '') {
          if (searchBy === 'name') {
            query = query.ilike('name', `%${searchQuery}%`);
          } else if (searchBy === 'chip') {
            query = query.ilike('chip_number', `%${searchQuery}%`);
          } else if (searchBy === 'owner') {
            // Use a join to filter by owner name instead of text search
            query = query.filter('owners.full_name', 'ilike', `%${searchQuery}%`);
          }
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map database animals to application Animal type
        const mappedAnimals: Animal[] = data.map(animal => ({
          id: animal.id,
          name: animal.name,
          type: animal.animal_type as AnimalType, // Explicitly cast to AnimalType
          breed: animal.breed || '',
          chipNo: animal.chip_number || '',
          healthNotes: animal.prone_diseases ? animal.prone_diseases.join(', ') : '',
          owner_id: animal.owner_id,
          created_at: animal.created_at,
          owner: {
            id: animal.owners.id,
            name: animal.owners.full_name,
            phone: animal.owners.phone_number,
            id_number: animal.owners.id_number
          },
          owners: animal.owners
        }));

        setAnimals(mappedAnimals);
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
  }, [type, searchQuery, searchBy, toast]);

  return { animals, isLoading, error };
}
