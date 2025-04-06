
import React from 'react';
import { InventoryItem } from '@/types/database.types';
import { InventoryLoading } from './InventoryLoading';
import { InventoryErrorState } from './InventoryErrorState';
import { InventoryEmptyState } from './InventoryEmptyState';
import { InventoryTableHeader } from './InventoryTableHeader';
import { InventoryItemCard } from './InventoryItem';
import { motion } from 'framer-motion';

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
  if (isLoading) {
    return <InventoryLoading />;
  }

  if (error) {
    return <InventoryErrorState error={error} />;
  }

  if (inventoryItems.length === 0) {
    return <InventoryEmptyState />;
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <InventoryTableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        toggleSort={toggleSort}
      />
      
      <motion.div className="space-y-3">
        {inventoryItems.map((item, index) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            index={index}
            onEditItem={onEditItem}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
