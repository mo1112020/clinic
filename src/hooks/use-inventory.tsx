
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching inventory with filters:', { searchQuery, categoryFilter, stockFilter, sortBy, sortDirection });
      
      let query = supabase.from('inventory').select('*');

      if (searchQuery) {
        query = query.ilike('product_name', `%${searchQuery}%`);
      }

      // Note: We're skipping categoryFilter since it's not in the database schema

      if (stockFilter === 'low') {
        query = query.lt('quantity', 10); // Using a fixed value instead of reorder_level
      } else if (stockFilter === 'out') {
        query = query.eq('quantity', 0);
      }

      if (sortBy && sortDirection) {
        // Map frontend sort field names to database column names
        const sortFieldMap: Record<string, string> = {
          'name': 'product_name',
          'stock': 'quantity',
          'price': 'price'
        };
        
        const dbSortField = sortFieldMap[sortBy] || sortBy;
        query = query.order(dbSortField, { ascending: sortDirection === 'asc' });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Inventory data received:', data);

      // Map database inventory to application InventoryItem type
      const mappedItems: InventoryItem[] = data.map(item => ({
        id: item.id,
        name: item.product_name,
        category: 'supplies', // Default category as it's not in the database
        stock: item.quantity,
        price: item.price,
        sold: 0, // Default value
        reorder_level: 5 // Default value
      }));

      setInventoryItems(mappedItems);

      // Calculate stats
      const totalItems = mappedItems.reduce((sum, item) => sum + item.stock, 0);
      const lowStockItems = mappedItems.filter(item => item.stock < item.reorder_level).length;
      const totalValue = mappedItems.reduce((sum, item) => sum + (item.stock * item.price), 0);

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
  }, [searchQuery, categoryFilter, stockFilter, sortBy, sortDirection, toast]);

  // Function to add a new item to the local state
  const addItem = (newItem: any) => {
    const mappedItem: InventoryItem = {
      id: newItem.id,
      name: newItem.product_name,
      category: 'supplies', // Default category
      stock: newItem.quantity,
      price: newItem.price,
      sold: 0,
      reorder_level: 5
    };
    
    setInventoryItems(prev => [mappedItem, ...prev]);
    
    // Update stats
    setStats(prev => ({
      totalItems: prev.totalItems + mappedItem.stock,
      lowStockItems: prev.lowStockItems + (mappedItem.stock < mappedItem.reorder_level ? 1 : 0),
      totalValue: prev.totalValue + (mappedItem.stock * mappedItem.price)
    }));
  };

  // Function to update an existing item in the local state
  const updateItem = (updatedItem: any) => {
    setInventoryItems(prev => {
      const newItems = prev.map(item => {
        if (item.id === updatedItem.id) {
          return {
            ...item,
            name: updatedItem.product_name,
            stock: updatedItem.quantity,
            price: updatedItem.price
          };
        }
        return item;
      });
      
      // Recalculate stats with new items
      const totalItems = newItems.reduce((sum, item) => sum + item.stock, 0);
      const lowStockItems = newItems.filter(item => item.stock < item.reorder_level).length;
      const totalValue = newItems.reduce((sum, item) => sum + (item.stock * item.price), 0);
      
      setStats({
        totalItems,
        lowStockItems,
        totalValue
      });
      
      return newItems;
    });
  };

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return { 
    inventoryItems, 
    stats, 
    isLoading, 
    error, 
    refreshInventory: fetchInventory,
    addItem,
    updateItem
  };
}
