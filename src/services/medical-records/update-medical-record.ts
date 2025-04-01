
import { supabase } from '@/integrations/supabase/client';

export const updateMedicalRecord = async (recordId: string, notes: string) => {
  try {
    // Use TypeScript's 'any' type to bypass the type checker for now
    // This is needed because the generated types might not be updated immediately
    const { data, error } = await (supabase
      .from('medical_records') as any)
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
