
import { supabase } from '@/lib/supabase';
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
  // First, create or update the owner
  const { data: ownerData, error: ownerError } = await supabase
    .from('owners')
    .upsert(
      {
        name: data.ownerName,
        id_number: data.ownerId,
        phone: data.ownerPhone
      },
      { onConflict: 'id_number' }
    )
    .select()
    .single();

  if (ownerError) {
    throw new Error(`Error creating owner: ${ownerError.message}`);
  }

  // Then create the animal linked to the owner
  const { data: animalData, error: animalError } = await supabase
    .from('animals')
    .insert({
      name: data.name,
      type: data.animalType,
      breed: data.breed,
      chipNo: data.chipNumber || null,
      healthNotes: data.healthNotes || null,
      owner_id: ownerData.id,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (animalError) {
    throw new Error(`Error creating animal: ${animalError.message}`);
  }

  return animalData;
}

export async function updateAnimal(id: string, data: AnimalFormData) {
  // First, update the owner
  const { data: ownerData, error: ownerError } = await supabase
    .from('owners')
    .upsert(
      {
        name: data.ownerName,
        id_number: data.ownerId,
        phone: data.ownerPhone
      },
      { onConflict: 'id_number' }
    )
    .select()
    .single();

  if (ownerError) {
    throw new Error(`Error updating owner: ${ownerError.message}`);
  }

  // Then update the animal
  const { data: animalData, error: animalError } = await supabase
    .from('animals')
    .update({
      name: data.name,
      type: data.animalType,
      breed: data.breed,
      chipNo: data.chipNumber || null,
      healthNotes: data.healthNotes || null,
      owner_id: ownerData.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (animalError) {
    throw new Error(`Error updating animal: ${animalError.message}`);
  }

  return animalData;
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
    throw new Error(`Error fetching animal: ${error.message}`);
  }

  return {
    ...data,
    owner: data.owners,
  };
}
