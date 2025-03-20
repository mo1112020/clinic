
import { supabase } from '@/integrations/supabase/client';
import { Animal } from '@/types/database.types';
import { AnimalFormData } from './types';
import { getOrCreateOwner } from '../owners/owner-service';

export async function updateAnimal(id: string, data: AnimalFormData): Promise<Animal> {
  try {
    // Check if we're updating to a chip number that already exists on another animal
    if (data.chipNumber) {
      const { data: existingAnimal } = await supabase
        .from('animals')
        .select('id')
        .eq('chip_number', data.chipNumber)
        .neq('id', id) // Exclude the current animal
        .maybeSingle();
        
      if (existingAnimal) {
        throw new Error(`An animal with chip number '${data.chipNumber}' already exists. Please use a different chip number.`);
      }
    }
    
    // First, update the owner
    const ownerId = await getOrCreateOwner({
      fullName: data.ownerName,
      idNumber: data.ownerId,
      phoneNumber: data.ownerPhone
    });

    // Parse health notes to array if provided
    const proneDiseasesArray = data.healthNotes ? [data.healthNotes] : null;
    
    // Then update the animal
    const { data: animalData, error: animalError } = await supabase
      .from('animals')
      .update({
        name: data.name,
        animal_type: data.animalType,
        breed: data.breed || null,
        chip_number: data.chipNumber || null,
        prone_diseases: proneDiseasesArray,
        owner_id: ownerId,
      })
      .eq('id', id)
      .select()
      .single();

    if (animalError) {
      console.error('Error updating animal:', animalError);
      
      // Provide a more helpful error message for constraint violations
      if (animalError.message.includes('violates unique constraint')) {
        if (animalError.message.includes('chip_number')) {
          throw new Error(`An animal with chip number '${data.chipNumber}' already exists. Please use a different chip number.`);
        }
      }
      
      throw new Error(`Error updating animal: ${animalError.message}`);
    }

    console.log('Animal updated successfully:', animalData);
    return animalData;
  } catch (error) {
    console.error('Animal update failed:', error);
    throw error;
  }
}
