
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingCart, Thermometer } from 'lucide-react';

type InventoryStatsProps = {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  isLoading: boolean;
};

export function InventoryStatCards({ totalItems, lowStockItems, totalValue, isLoading }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Items</p>
              <p className="text-3xl font-bold">{isLoading ? '-' : totalItems}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
              <p className="text-3xl font-bold">{isLoading ? '-' : lowStockItems}</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <ShoppingCart className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-3xl font-bold">${isLoading ? '-' : totalValue.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <Thermometer className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
