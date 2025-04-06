
import React from 'react';
import { Package } from 'lucide-react';
import { motion } from 'framer-motion';

export function InventoryEmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.2,
          type: "spring",
          stiffness: 200
        }}
        className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center mb-3"
      >
        <Package className="h-6 w-6 text-muted-foreground" />
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-medium mb-1"
      >
        No items found
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-sm text-muted-foreground"
      >
        Try adjusting your search or filter to find what you're looking for.
      </motion.p>
    </motion.div>
  );
}
