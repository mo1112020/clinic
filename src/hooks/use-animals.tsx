
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
            // For owner search, we'll fetch all animals and filter them client-side
            // This is a more reliable approach when dealing with joined tables
          }
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map database animals to application Animal type with null checks
        const mappedAnimals: Animal[] = data
          .filter(animal => animal) // Filter out any null animals
          .map(animal => ({
            id: animal.id,
            name: animal.name,
            type: animal.animal_type as AnimalType,
            breed: animal.breed || '',
            chipNo: animal.chip_number || '',
            healthNotes: animal.health_notes || '',
            owner_id: animal.owner_id,
            created_at: animal.created_at,
            last_visit: animal.updated_at || animal.created_at, // Use updated_at as last_visit if available
            owner: animal.owners ? {
              id: animal.owners.id,
              name: animal.owners.full_name,
              phone: animal.owners.phone_number,
              id_number: animal.owners.id_number
            } : null
          }));

        // If searching by owner, filter results client-side
        let filteredAnimals = mappedAnimals;
        if (searchBy === 'owner' && searchQuery && searchQuery.trim() !== '') {
          filteredAnimals = mappedAnimals.filter(animal => 
            animal.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setAnimals(filteredAnimals);
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
