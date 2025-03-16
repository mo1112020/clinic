
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Syringe, Pill, Scissors, ShoppingBag } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type InventoryFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string[];
  setCategoryFilter: (categories: string[]) => void;
  stockFilter: string | undefined;
  setStockFilter: (filter: string | undefined) => void;
};

export function InventoryFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
}: InventoryFiltersProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inventory..."
          className="pl-9 glass-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div>
        <ToggleGroup 
          type="multiple" 
          className="justify-start flex-wrap"
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <ToggleGroupItem value="vaccine" className="gap-1">
            <Syringe className="h-3.5 w-3.5" />
            Vaccines
          </ToggleGroupItem>
          <ToggleGroupItem value="medication" className="gap-1">
            <Pill className="h-3.5 w-3.5" />
            Medications
          </ToggleGroupItem>
          <ToggleGroupItem value="supplies" className="gap-1">
            <Scissors className="h-3.5 w-3.5" />
            Supplies
          </ToggleGroupItem>
          <ToggleGroupItem value="food" className="gap-1">
            <ShoppingBag className="h-3.5 w-3.5" />
            Food
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div>
        <ToggleGroup 
          type="single" 
          className="justify-start"
          value={stockFilter}
          onValueChange={setStockFilter}
        >
          <ToggleGroupItem value="low">Low Stock</ToggleGroupItem>
          <ToggleGroupItem value="out">Out of Stock</ToggleGroupItem>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
