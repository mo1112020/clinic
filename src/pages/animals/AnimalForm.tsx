
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useAnimalForm } from '@/hooks/use-animal-form';
import AnimalInformationForm from '@/components/animals/AnimalInformationForm';
import OwnerInformationForm from '@/components/animals/OwnerInformationForm';
import AnimalFormActions from '@/components/animals/AnimalFormActions';

const AnimalForm = () => {
  const { id } = useParams();
  const { form, isLoading, isSubmitting, isNewAnimal, onSubmit } = useAnimalForm(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading animal data...</p>
        </div>
      </div>
    );
  }

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
            <AnimalInformationForm form={form} />
            <OwnerInformationForm form={form} />
            <AnimalFormActions isSubmitting={isSubmitting} isNewAnimal={isNewAnimal} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AnimalForm;
