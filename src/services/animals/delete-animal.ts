
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export async function deleteAnimal(id: string): Promise<{ success: boolean }> {
  try {
    // First check if the animal exists
    const { data: animalData, error: animalCheckError } = await supabase
      .from('animals')
      .select('id')
      .eq('id', id)
      .single();

    if (animalCheckError || !animalData) {
      console.error('Error checking animal:', animalCheckError?.message || 'Animal not found');
      throw new Error(`Animal not found or error checking: ${animalCheckError?.message || 'Not found'}`);
    }

    // First delete any related records in vaccinations table
    const { error: vaccinationsError } = await supabase
      .from('vaccinations')
      .delete()
      .eq('animal_id', id);

    if (vaccinationsError) {
      console.error('Error deleting vaccinations:', vaccinationsError.message);
    }

    // Then delete any related records in medical_records table
    const { error: medicalRecordsError } = await supabase
      .from('medical_records')
      .delete()
      .eq('animal_id', id);

    if (medicalRecordsError) {
      console.error('Error deleting medical records:', medicalRecordsError.message);
    }

    // Then delete any related records in medical_files table
    const { error: medicalFilesError } = await supabase
      .from('medical_files')
      .delete()
      .eq('animal_id', id);

    if (medicalFilesError) {
      console.error('Error deleting medical files:', medicalFilesError.message);
    }

    // Finally delete the animal record
    const { error: animalError } = await supabase
      .from('animals')
      .delete()
      .eq('id', id);

    if (animalError) {
      throw new Error(`Error deleting animal: ${animalError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete operation failed:', error);
    throw error;
  }
}
