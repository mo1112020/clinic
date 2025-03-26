
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
