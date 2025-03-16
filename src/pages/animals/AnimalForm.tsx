
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';

// Animal form schema
const formSchema = z.object({
  animalType: z.enum(['cat', 'dog', 'bird']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  breed: z.string().min(2, 'Breed must be at least 2 characters'),
  chipNumber: z.string().optional(),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerId: z.string().min(2, 'Owner ID is required'),
  ownerPhone: z.string().min(8, 'Valid phone number is required'),
  healthNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AnimalFormProps {
  animalId?: string;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ animalId }) => {
  const { toast } = useToast();
  const isNewAnimal = !animalId;
  
  const defaultValues: Partial<FormValues> = {
    animalType: 'dog',
    name: '',
    breed: '',
    chipNumber: '',
    ownerName: '',
    ownerId: '',
    ownerPhone: '',
    healthNotes: '',
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    toast({
      title: isNewAnimal ? 'Animal created successfully' : 'Animal updated successfully',
      description: `${data.name} has been ${isNewAnimal ? 'added to' : 'updated in'} the system.`,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto glass-card">
      <CardHeader>
        <CardTitle className="text-2xl">{isNewAnimal ? 'Register New Patient' : 'Edit Patient'}</CardTitle>
        <CardDescription>
          {isNewAnimal ? 'Add a new animal to the system' : 'Update the animal information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex justify-end space-x-4"
            >
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                <Save className="mr-2 h-4 w-4" />
                {isNewAnimal ? 'Register Patient' : 'Update Patient'}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AnimalForm;
