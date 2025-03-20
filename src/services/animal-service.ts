
import { supabase } from '@/integrations/supabase/client';
import { Animal, AnimalType } from '@/types/database.types';

export interface AnimalFormData {
  animalType: AnimalType;
  name: string;
  breed: string;
  chipNumber?: string;
  ownerName: string;
  ownerId: string;
  ownerPhone: string;
  healthNotes?: string;
}

export async function createAnimal(data: AnimalFormData) {
  console.log('Creating animal with data:', data);
  
  try {
    // First, create or update the owner
    const { data: ownerData, error: ownerError } = await supabase
      .from('owners')
      .upsert(
        {
          full_name: data.ownerName,
          id_number: data.ownerId,
          phone_number: data.ownerPhone
        },
        { onConflict: 'id_number' }
      )
      .select()
      .single();

    if (ownerError) {
      console.error('Error creating owner:', ownerError);
      throw new Error(`Error creating owner: ${ownerError.message}`);
    }

    console.log('Owner created or updated:', ownerData);

    // Parse health notes to array if provided
    const proneDiseasesArray = data.healthNotes ? [data.healthNotes] : null;
    
    // Then create the animal linked to the owner
    const { data: animalData, error: animalError } = await supabase
      .from('animals')
      .insert({
        name: data.name,
        animal_type: data.animalType,
        breed: data.breed || null,
        chip_number: data.chipNumber || null,
        prone_diseases: proneDiseasesArray,
        owner_id: ownerData.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (animalError) {
      console.error('Error creating animal:', animalError);
      throw new Error(`Error creating animal: ${animalError.message}`);
    }

    console.log('Animal created:', animalData);
    return animalData;
  } catch (error) {
    console.error('Animal creation failed:', error);
    throw error;
  }
}

export async function updateAnimal(id: string, data: AnimalFormData) {
  try {
    // First, update the owner
    const { data: ownerData, error: ownerError } = await supabase
      .from('owners')
      .upsert(
        {
          full_name: data.ownerName,
          id_number: data.ownerId,
          phone_number: data.ownerPhone
        },
        { onConflict: 'id_number' }
      )
      .select()
      .single();

    if (ownerError) {
      throw new Error(`Error updating owner: ${ownerError.message}`);
    }

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
        owner_id: ownerData.id,
      })
      .eq('id', id)
      .select()
      .single();

    if (animalError) {
      throw new Error(`Error updating animal: ${animalError.message}`);
    }

    return animalData;
  } catch (error) {
    console.error('Animal update failed:', error);
    throw error;
  }
}

export async function deleteAnimal(id: string) {
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

export async function getAnimalById(id: string) {
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
