
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AnimalFormValues } from '@/schemas/animal-form-schema';
import { motion } from 'framer-motion';

interface OwnerInformationFormProps {
  form: UseFormReturn<AnimalFormValues>;
}

const OwnerInformationForm: React.FC<OwnerInformationFormProps> = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium">Owner Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter owner name" {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner ID Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter owner ID number" {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="ownerPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Owner Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter owner phone number" {...field} className="glass-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

export default OwnerInformationForm;
