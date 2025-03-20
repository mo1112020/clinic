
import { supabase } from '@/integrations/supabase/client';
import { Animal } from '@/types/database.types';

export async function getAnimalById(id: string): Promise<any> {
  const { data, error } = await supabase
    .from('animals')
    .select(`
      *,
      owners(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching animal:', error);
    throw new Error(`Error fetching animal: ${error.message}`);
  }

  return {
    ...data,
    owner: data.owners,
  };
}
