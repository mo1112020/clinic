
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
      .select();

    if (ownerError) {
      console.error('Error creating owner:', ownerError);
      throw new Error(`Error creating owner: ${ownerError.message}`);
    }

    let ownerId: string;
    
    if (ownerData && ownerData.length > 0 && ownerData[0].id) {
      ownerId = ownerData[0].id;
      console.log('Owner created or updated:', ownerData[0]);
    } else {
      console.error('No owner data returned or empty array:', ownerData);
      
      // Attempt to fetch the owner by id_number since upsert might have succeeded
      // but not returned data due to RLS issues
      const { data: fetchedOwner, error: fetchError } = await supabase
        .from('owners')
        .select('id')
        .eq('id_number', data.ownerId)
        .single();
        
      if (fetchError || !fetchedOwner) {
        console.error('Failed to fetch owner after upsert:', fetchError);
        throw new Error('Failed to create or find owner');
      }
      
      console.log('Found owner after upsert:', fetchedOwner);
      ownerId = fetchedOwner.id;
    }

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
        owner_id: ownerId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (animalError) {
      console.error('Error creating animal:', animalError);
      throw new Error(`Error creating animal: ${animalError.message}`);
    }

    console.log('Animal created successfully:', animalData);
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
      .select();

    if (ownerError) {
      console.error('Error updating owner:', ownerError);
      throw new Error(`Error updating owner: ${ownerError.message}`);
    }

    let ownerId: string;
    
    if (ownerData && ownerData.length > 0 && ownerData[0].id) {
      ownerId = ownerData[0].id;
      console.log('Owner updated:', ownerData[0]);
    } else {
      // Attempt to fetch the owner by id_number
      const { data: fetchedOwner, error: fetchError } = await supabase
        .from('owners')
        .select('id')
        .eq('id_number', data.ownerId)
        .single();
        
      if (fetchError || !fetchedOwner) {
        console.error('Failed to fetch owner after upsert:', fetchError);
        throw new Error('Failed to create or find owner');
      }
      
      console.log('Found owner after upsert:', fetchedOwner);
      ownerId = fetchedOwner.id;
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
        owner_id: ownerId,
      })
      .eq('id', id)
      .select()
      .single();

    if (animalError) {
      console.error('Error updating animal:', animalError);
      throw new Error(`Error updating animal: ${animalError.message}`);
    }

    console.log('Animal updated successfully:', animalData);
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
