import { supabase } from '@/integrations/supabase/client';

export async function fetchMedicalFiles(categoryFilter?: string) {
  let medicalFilesQuery = supabase
    .from('medical_files')
    .select(`
      *,
      animals (
        id,
        name,
        animal_type,
        breed,
        chip_number,
        health_notes,
        owner_id,
        owners (
          id,
          full_name,
          phone_number
        )
      )
    `);

  if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'Health Record') {
    medicalFilesQuery = medicalFilesQuery.eq('file_type', categoryFilter);
  }
  
  const { data, error } = await medicalFilesQuery;
  
  if (error) {
    console.error('Error fetching medical files:', error);
    throw error;
  }
  
  return data || [];
}

export async function fetchAnimals() {
  const { data, error } = await supabase
    .from('animals')
    .select(`
      id,
      name,
      animal_type,
      breed,
      chip_number,
      health_notes,
      owner_id,
      owners (
        id,
        full_name,
        phone_number
      )
    `);

  if (error) {
    console.error('Error fetching animals:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetches medical records with proper joins to animals and owners tables
 */
export async function fetchMedicalRecords(animalType?: string, searchQuery?: string) {
  let query = supabase
    .from('medical_records')
    .select(`
      *,
      animals (
        id,
        name,
        animal_type,
        owner_id,
        owners (
          id,
          full_name
        )
      )
    `);

  // Handle animal type filtering
  if (animalType && animalType !== 'all') {
    query = query.eq('animals.animal_type', animalType);
  }

  // Handle search query - needs to be applied separately from the animal type filter
  if (searchQuery && searchQuery.trim() !== '') {
    // Use ilike with the search query for each field separately
    query = query.or(`animals.name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }

  return data || [];
}
