
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AnimalFormValues } from '@/schemas/animal-form-schema';
import { motion } from 'framer-motion';

interface AnimalInformationFormProps {
  form: UseFormReturn<AnimalFormValues>;
}

const AnimalInformationForm: React.FC<AnimalInformationFormProps> = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium">Animal Information</h3>
      
      <FormField
        control={form.control}
        name="animalType"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Animal Type</FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-x-4"
            >
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="dog" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">Dog</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="cat" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">Cat</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="bird" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">Bird</FormLabel>
              </FormItem>
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Animal Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter animal name" {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Breed</FormLabel>
              <FormControl>
                <Input placeholder="Enter breed" {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="chipNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Microchip Number (optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter microchip number" {...field} className="glass-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="healthNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Health Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter any health conditions, allergies, or diseases the animal is prone to"
                className="glass-input min-h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

export default AnimalInformationForm;
