
import { supabase } from '@/integrations/supabase/client';

export const updateMedicalRecord = async (
  recordId: string, 
  notes: string,
  description?: string
) => {
  try {
    // Validate recordId - should be a UUID
    if (!recordId || typeof recordId !== 'string' || recordId.length < 10) {
      throw new Error('Invalid medical record ID format');
    }

    // Create the update payload
    const updatePayload: { notes: string; description?: string } = { notes };
    
    // Only add description if it's provided
    if (description) {
      updatePayload.description = description;
    }
    
    console.log(`Updating medical record: ${recordId}`, updatePayload);

    const { data, error } = await supabase
      .from('medical_records')
      .update(updatePayload)
      .eq('id', recordId)
      .select();

    if (error) throw error;

    console.log('Update successful:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error updating medical record:', error);
    return { data: null, error };
  }
};
