
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
      // Find the vaccination in our state
      const vaccination = vaccinations.find(v => v.id === id);
      
      if (!vaccination) {
        throw new Error('Vaccination not found');
      }

      // Format phone number for WhatsApp
      const phoneNumber = formatPhoneForWhatsApp(vaccination.ownerPhone);
      
      // Create message
      const message = `Hello ${vaccination.ownerName}, this is a reminder that ${vaccination.animalName} is due for a ${vaccination.vaccineName} vaccination on ${format(new Date(vaccination.date), 'MMMM d, yyyy')}. Please contact the clinic to confirm the appointment.`;
      
      // Open WhatsApp with the message
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');

      toast({
        title: "WhatsApp opened",
        description: "Continue in WhatsApp to send the reminder message.",
      });
    } catch (err) {
      console.error('Error sending reminder:', err);
      toast({
        title: 'Error',
        description: 'Failed to open WhatsApp. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSendingReminders(prev => prev.filter(reminderId => reminderId !== id));
    }
  };

  // Format phone number for WhatsApp API (remove any non-digit characters)
  const formatPhoneForWhatsApp = (phone: string): string => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  };

  return { vaccinations, isLoading, error, sendingReminders, sendReminder };
}
