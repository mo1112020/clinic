
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { InventoryItem } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';

export function useInventory(
  searchQuery?: string,
  categoryFilter?: string[],
  stockFilter?: string,
  sortBy?: string,
  sortDirection?: 'asc' | 'desc'
) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase.from('inventory').select('*');

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        if (categoryFilter && categoryFilter.length > 0) {
          query = query.in('category', categoryFilter);
        }

        if (stockFilter === 'low') {
          query = query.lt('stock', supabase.raw('reorder_level'));
        } else if (stockFilter === 'out') {
          query = query.eq('stock', 0);
        }

        if (sortBy && sortDirection) {
          query = query.order(sortBy, { ascending: sortDirection === 'asc' });
        }

        const { data, error } = await query;

        if (error) throw error;

        setInventoryItems(data as InventoryItem[]);

        // Calculate stats
        const totalItems = data.reduce((sum, item) => sum + item.stock, 0);
        const lowStockItems = data.filter(item => item.stock < item.reorder_level).length;
        const totalValue = data.reduce((sum, item) => sum + (item.stock * item.price), 0);

        setStats({
          totalItems,
          lowStockItems,
          totalValue
        });
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Failed to load inventory');
        toast({
          title: 'Error',
          description: 'Failed to load inventory. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [searchQuery, categoryFilter, stockFilter, sortBy, sortDirection, toast]);

  return { inventoryItems, stats, isLoading, error };
}
