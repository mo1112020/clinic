
import React from 'react';
import { Package } from 'lucide-react';

export function InventoryEmptyState() {
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
