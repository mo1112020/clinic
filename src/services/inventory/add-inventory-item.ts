
import { supabase } from '@/integrations/supabase/client';

export interface InventoryItemData {
  productName: string;
  quantity: number;
  price: number;
}

export async function addInventoryItem(data: InventoryItemData) {
  try {
    const { data: item, error } = await supabase
      .from('inventory')
      .insert({
        product_name: data.productName,
        quantity: data.quantity,
        price: data.price
      })
      .select()
      .single();
      
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return item;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
}
