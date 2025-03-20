
import { supabase } from '@/integrations/supabase/client';
import { Animal } from '@/types/database.types';

export interface CatListItem {
  id: string;
  name: string;
  type: string;
  breed: string;
  chipNo: string;
  owner: string;
  ownerPhone: string;
  lastVisit?: string;
}

export async function getCats(): Promise<CatListItem[]> {
  try {
    // Query animals of type 'cat' along with their owners
    const { data: cats, error } = await supabase
      .from('animals')
      .select(`
        id,
        name,
        animal_type,
        breed,
        chip_number,
        created_at,
        owners:owner_id (
          full_name,
          phone_number
        )
      `)
      .eq('animal_type', 'cat');

    if (error) {
      console.error('Error fetching cats:', error);
      throw new Error(`Failed to fetch cats: ${error.message}`);
    }

    // Transform the data to match the CatListItem interface
    return cats.map(cat => ({
      id: cat.id,
      name: cat.name,
      type: 'cat',
      breed: cat.breed || '',
      chipNo: cat.chip_number || '',
      owner: cat.owners?.full_name || 'Unknown Owner',
      ownerPhone: cat.owners?.phone_number || 'No phone',
      lastVisit: new Date(cat.created_at).toISOString().split('T')[0], // Using created_at as last visit for now
    }));
  } catch (error) {
    console.error('Failed to retrieve cats:', error);
    throw error;
  }
}
