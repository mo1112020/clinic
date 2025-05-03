
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

  // Add console log to debug the data returned from Supabase
  console.log('Animal data from database:', data);

  return {
    ...data,
    owner: data.owners,
    age_years: data.age_years || undefined,
    age_months: data.age_months || undefined,
  };
}
