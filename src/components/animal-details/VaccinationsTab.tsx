
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Vaccination } from '@/types/database.types';
import { ScheduleVaccinationDialog } from './ScheduleVaccinationDialog';

interface VaccinationsTabProps {
  vaccinations: Vaccination[];
  animalId: string;
  animalName: string;
  onVaccinationScheduled?: () => void;
}

const VaccinationsTab: React.FC<VaccinationsTabProps> = ({ 
  vaccinations, 
  animalId, 
  animalName,
  onVaccinationScheduled 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Vaccination Records</CardTitle>
          <CardDescription>View and manage vaccination schedule</CardDescription>
        </div>
        <ScheduleVaccinationDialog 
          animalId={animalId} 
          animalName={animalName}
          onVaccinationScheduled={onVaccinationScheduled}
        />
      </CardHeader>
      <CardContent>
        {vaccinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No vaccination records found for this animal.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vaccinations.map((vax) => (
              <motion.div
                key={vax.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3 md:mb-0">
                  <div>
                    <Badge variant={vax.status === 'completed' ? 'secondary' : 'default'} className="mb-2 md:mb-0">
                      {vax.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{vax.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {vax.status === 'completed' 
                        ? `Administered on ${format(new Date(vax.date), 'MMMM d, yyyy')}` 
                        : `Scheduled for ${format(new Date(vax.next_due), 'MMMM d, yyyy')}`}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Next due: <span className="text-primary">{format(new Date(vax.next_due), 'MMMM d, yyyy')}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VaccinationsTab;
