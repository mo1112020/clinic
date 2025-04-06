
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

type InventoryErrorStateProps = {
  error: string;
};

export function InventoryErrorState({ error }: InventoryErrorStateProps) {
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
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto bg-destructive/10 rounded-full w-12 h-12 flex items-center justify-center mb-3"
      >
        <AlertCircle className="h-6 w-6 text-destructive" />
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-medium mb-1 text-destructive"
      >
        Error Loading Data
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-sm text-muted-foreground"
      >
        {error}
      </motion.p>
    </motion.div>
  );
}
