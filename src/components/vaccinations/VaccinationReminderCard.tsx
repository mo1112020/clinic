
import { format } from 'date-fns';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { VaccinationStatusBadge } from './VaccinationStatusBadge';
import { VaccinationAnimalIcon } from './VaccinationAnimalIcon';
import { AnimalType } from '@/types/database.types';

export interface VaccinationReminderItem {
  id: number;
  animalName: string;
  animalType: AnimalType;
  ownerName: string;
  ownerPhone: string;
  vaccineName: string;
  date: string;
  nextDue: string;
  status: 'today' | 'upcoming' | 'overdue';
}

interface VaccinationReminderCardProps {
  reminder: VaccinationReminderItem;
  index: number;
  isSending: boolean;
  onSendReminder: (id: number) => void;
}

export const VaccinationReminderCard = ({ 
  reminder, 
  index, 
  isSending, 
  onSendReminder 
}: VaccinationReminderCardProps) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      custom={index}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
            <VaccinationAnimalIcon type={reminder.animalType} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{reminder.animalName}</p>
              <VaccinationStatusBadge status={reminder.status} />
            </div>
            <p className="text-sm text-muted-foreground">{reminder.vaccineName}</p>
          </div>
        </div>
        
        <div className="sm:text-right">
          <p className="text-sm">
            <span className="text-muted-foreground">Owner: </span>
            <span className="font-medium">{reminder.ownerName}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Date: </span>
            <span className="font-medium">{format(new Date(reminder.date), 'MMMM d, yyyy')}</span>
          </p>
        </div>
        
        <div>
          <Button 
            className="btn-primary w-full sm:w-auto"
            onClick={() => onSendReminder(reminder.id)}
            disabled={isSending}
          >
            {isSending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </div>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Reminder
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
