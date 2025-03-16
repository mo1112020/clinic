
import React from 'react';
import { Loader2 } from 'lucide-react';

export function InventoryLoading() {
  return (
    <div className="text-center py-12">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
      <p className="text-muted-foreground">Loading inventory items...</p>
    </div>
  );
}
