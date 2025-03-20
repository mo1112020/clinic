
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vaccination } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';
import { format, isPast, isToday } from 'date-fns';

export function useVaccinations(filter: 'today' | 'upcoming' | 'overdue' | 'all' = 'all') {
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingReminders, setSendingReminders] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVaccinations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Join vaccinations with animals and owners to get complete data
        let query = supabase
          .from('vaccinations')
          .select(`
            *,
            animals (
              id,
              name,
              animal_type,
              owners (
                full_name,
                phone_number
              )
            )
          `);

        // Apply filter based on date
        const today = format(new Date(), 'yyyy-MM-dd');
        
        if (filter === 'today') {
          query = query.eq('scheduled_date', today);
        } else if (filter === 'upcoming') {
          query = query.gt('scheduled_date', today).lt('scheduled_date', format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
        } else if (filter === 'overdue') {
          query = query.lt('scheduled_date', today);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to include animal type and owner information
        const formattedData = data.map(item => ({
          id: item.id,
          animalName: item.animals.name,
          animalType: item.animals.animal_type,
          ownerName: item.animals.owners.full_name,
          ownerPhone: item.animals.owners.phone_number,
          vaccineName: item.vaccine_name,
          date: item.scheduled_date,
          nextDue: item.scheduled_date, // Using the same date for demo
          status: getReminderStatus(item.scheduled_date)
        }));

        setVaccinations(formattedData);
      } catch (err) {
        console.error('Error fetching vaccinations:', err);
        setError('Failed to load vaccination reminders');
        toast({
          title: 'Error',
          description: 'Failed to load vaccination reminders. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaccinations();
  }, [filter, toast]);

  const getReminderStatus = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) return 'today';
    if (isPast(date)) return 'overdue';
    return 'upcoming';
  };

  const sendReminder = async (id: number) => {
    setSendingReminders(prev => [...prev, id]);
    
    try {
      // In a real application, this would call a Supabase Edge Function to send SMS/email
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast({
        title: "Reminder sent",
        description: "The vaccination reminder has been sent to the owner.",
      });
    } catch (err) {
      console.error('Error sending reminder:', err);
      toast({
        title: 'Error',
        description: 'Failed to send reminder. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSendingReminders(prev => prev.filter(reminderId => reminderId !== id));
    }
  };

  return { vaccinations, isLoading, error, sendingReminders, sendReminder };
}
