
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MedicalRecord } from '@/types/database.types';

interface MedicalHistoryTabProps {
  medicalHistory: MedicalRecord[];
}

const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({ medicalHistory }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Past conditions, treatments, and visits</CardDescription>
        </div>
        <Button className="btn-primary">
          <Activity className="mr-2 h-4 w-4" />
          Add New Entry
        </Button>
      </CardHeader>
      <CardContent>
        {medicalHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No medical history found for this animal.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalHistory.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <p className="font-medium">{entry.description}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(entry.date), 'MMMM d, yyyy')}</p>
                </div>
                <p className="text-sm">{entry.notes}</p>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalHistoryTab;
