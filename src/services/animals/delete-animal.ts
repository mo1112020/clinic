
import { supabase } from '@/integrations/supabase/client';

export async function deleteAnimal(id: string): Promise<{ success: boolean }> {
  // Delete the animal record
  const { error: animalError } = await supabase
    .from('animals')
    .delete()
    .eq('id', id);

  if (animalError) {
    throw new Error(`Error deleting animal: ${animalError.message}`);
  }

  return { success: true };
}
