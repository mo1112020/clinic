
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type InventoryTableHeaderProps = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  toggleSort: (field: string) => void;
};

export function InventoryTableHeader({
  sortBy,
  sortDirection,
  toggleSort,
}: InventoryTableHeaderProps) {
  return (
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
  );
}
