
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Dog, Cat, Bird, Calendar, Clock, Clipboard } from 'lucide-react';
import { Animal } from '@/types/database.types';

interface PatientInformationProps {
  animal: Animal;
}

const PatientInformation: React.FC<PatientInformationProps> = ({ animal }) => {
  const getAnimalIcon = () => {
    switch (animal.type) {
      case 'dog':
        return <Dog className="h-5 w-5" />;
      case 'cat':
        return <Cat className="h-5 w-5" />;
      case 'bird':
        return <Bird className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="glass-card lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-muted p-2 rounded-full">
            {getAnimalIcon()}
          </div>
          <CardTitle>Patient Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Animal Type</p>
            <p className="font-medium capitalize">{animal.type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Breed</p>
            <p className="font-medium">{animal.breed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p className="font-medium">{animal.age || 'Not specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Microchip Number</p>
            {animal.chipNo ? (
              <div className="flex items-center gap-2">
                <Clipboard className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{animal.chipNo}</p>
              </div>
            ) : (
              <p className="font-medium text-muted-foreground">Not registered</p>
            )}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium mb-3">Health Notes</h3>
          <div className="bg-muted/40 p-4 rounded-lg">
            <p className="text-sm">{animal.healthNotes || 'No health notes available.'}</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium mb-3">Appointments</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-muted/40 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
              </div>
              <p className="font-medium">{format(new Date(animal.created_at), 'MMMM d, yyyy')}</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
              </div>
              <p className="font-medium">{animal.last_visit ? format(new Date(animal.last_visit), 'MMMM d, yyyy') : 'No visits recorded'}</p>
            </div>
            {animal.next_appointment && (
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-primary">Next Appointment</p>
                </div>
                <p className="font-medium text-primary">{format(new Date(animal.next_appointment), 'MMMM d, yyyy')}</p>
              </div>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PatientInformation;
