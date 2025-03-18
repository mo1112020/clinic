
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Syringe, Pill, Scissors, ShoppingBag, Package, Loader2, Pencil } from 'lucide-react';
import { InventoryItem } from '@/types/database.types';
import { motion } from 'framer-motion';
import { InventoryLoading } from './InventoryLoading';

type InventoryTableProps = {
  inventoryItems: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  toggleSort: (field: string) => void;
  onEditItem: (item: InventoryItem) => void;
};

export function InventoryTable({
  inventoryItems,
  isLoading,
  error,
  sortBy,
  sortDirection,
  toggleSort,
  onEditItem,
}: InventoryTableProps) {

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vaccine':
        return <Syringe className="h-4 w-4" />;
      case 'medication':
        return <Pill className="h-4 w-4" />;
      case 'supplies':
        return <Scissors className="h-4 w-4" />;
      case 'food':
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };
  
  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-destructive text-destructive-foreground' };
    if (stock < reorderLevel) return { label: 'Low Stock', className: 'bg-amber-500 text-white' };
    return { label: 'In Stock', className: 'bg-emerald-500 text-white' };
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
      },
    }),
  };

  if (isLoading) {
    return <InventoryLoading />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>Error loading inventory: {error}</p>
      </div>
    );
  }

  if (inventoryItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center mb-3">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-1">No items found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }
  
  return (
    <>
      {/* Table Header */}
      <div className="hidden md:flex items-center border-b pb-2">
        <div className="flex-1 font-medium">
          <Button variant="ghost" className="px-2 font-medium" onClick={() => toggleSort('name')}>
            Product Name
            {sortBy === 'name' && (
              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </Button>
        </div>
        <div className="w-28 text-center font-medium">
          <Button variant="ghost" className="px-2 font-medium" onClick={() => toggleSort('stock')}>
            Stock
            {sortBy === 'stock' && (
              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </Button>
        </div>
        <div className="w-28 text-center font-medium">
          <Button variant="ghost" className="px-2 font-medium" onClick={() => toggleSort('price')}>
            Price
            {sortBy === 'price' && (
              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </Button>
        </div>
        <div className="w-28 text-center font-medium">
          <Button variant="ghost" className="px-2 font-medium" onClick={() => toggleSort('sold')}>
            Sold
            {sortBy === 'sold' && (
              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </Button>
        </div>
        <div className="w-28 text-center font-medium">Status</div>
        <div className="w-20 text-center font-medium">Actions</div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {inventoryItems.map((item, index) => {
          const stockStatus = getStockStatus(item.stock, item.reorder_level);
          
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={index}
            >
              <div className="flex flex-col md:flex-row md:items-center p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                {/* Mobile View */}
                <div className="md:hidden space-y-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-muted rounded-full">
                        {getCategoryIcon(item.category)}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <Badge className={stockStatus.className}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Stock</p>
                      <p className="font-medium">{item.stock}</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Sold</p>
                      <p className="font-medium">{item.sold}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => onEditItem(item)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                {/* Desktop View */}
                <div className="hidden md:flex md:flex-1 md:items-center">
                  <div className="p-1.5 bg-muted rounded-full mr-3">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="hidden md:block md:w-28 text-center">{item.stock}</div>
                <div className="hidden md:block md:w-28 text-center">${item.price.toFixed(2)}</div>
                <div className="hidden md:block md:w-28 text-center">{item.sold}</div>
                <div className="hidden md:block md:w-28 text-center">
                  <Badge className={stockStatus.className}>
                    {stockStatus.label}
                  </Badge>
                </div>
                <div className="hidden md:block md:w-20 text-center">
                  <Button variant="ghost" size="sm" onClick={() => onEditItem(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
