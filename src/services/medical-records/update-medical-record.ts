
import { supabase } from '@/integrations/supabase/client';

export const updateMedicalRecord = async (recordId: string, notes: string) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .update({ notes })
      .eq('id', recordId)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating medical record:', error);
    return { data: null, error };
  }
};
