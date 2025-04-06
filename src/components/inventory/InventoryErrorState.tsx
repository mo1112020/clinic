
import React from 'react';

type InventoryErrorStateProps = {
  error: string;
};

export function InventoryErrorState({ error }: InventoryErrorStateProps) {
  return (
    <div className="text-center py-12 text-destructive">
      <p>Error loading inventory: {error}</p>
    </div>
  );
}
