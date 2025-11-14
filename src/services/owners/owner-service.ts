
import { supabase } from '@/integrations/supabase/client';

export interface OwnerData {
  fullName: string;
  idNumber: string;
  phoneNumber: string;
}

export async function getOrCreateOwner(data: OwnerData): Promise<string> {
  try {
    // Create or update the owner
    const { data: ownerData, error: ownerError } = await supabase
      .from('owners')
      .upsert(
        {
          full_name: data.fullName,
          id_number: data.idNumber,
          phone_number: data.phoneNumber
        },
        { onConflict: 'id_number' }
      )
      .select();

    if (ownerError) {
      console.error('Error creating/updating owner:', ownerError);
      throw new Error(`Error creating/updating owner: ${ownerError.message}`);
    }

    let ownerId: string;
    
    if (ownerData && ownerData.length > 0 && ownerData[0].id) {
      ownerId = ownerData[0].id;
    } else {
      // Attempt to fetch the owner by id_number since upsert might have succeeded
      // but not returned data due to RLS issues
      const { data: fetchedOwner, error: fetchError } = await supabase
        .from('owners')
        .select('id')
        .eq('id_number', data.idNumber)
        .single();
        
      if (fetchError || !fetchedOwner) {
        console.error('Failed to fetch owner after upsert:', fetchError);
        throw new Error('Failed to create or find owner');
      }
      
      ownerId = fetchedOwner.id;
    }

    return ownerId;
  } catch (error) {
    console.error('Owner operation failed:', error);
    throw error;
  }
}
