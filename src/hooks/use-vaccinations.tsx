
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vaccination } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';
import { format, isPast, isToday, addDays, isAfter } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

export function useVaccinations(filter: 'today' | 'upcoming' | 'overdue' | 'all' = 'all') {
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingReminders, setSendingReminders] = useState<number[]>([]);
  const [completingVaccinations, setCompletingVaccinations] = useState<number[]>([]);
  const { toast } = useToast();
  const { language } = useLanguage();

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

        // Only show non-completed vaccinations by default, except for 'all' filter
        if (filter !== 'all') {
          query = query.eq('completed', false);
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
          status: getReminderStatus(item.scheduled_date),
          completed: item.completed
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
    
    // Set up a timer to auto-clean missed vaccinations
    const cleanupInterval = setInterval(() => {
      cleanupMissedVaccinations();
    }, 86400000); // Run once a day
    
    return () => {
      clearInterval(cleanupInterval);
    };
  }, [filter, toast]);
  
  // Function to clean up missed vaccinations
  const cleanupMissedVaccinations = async () => {
    try {
      const twoDaysAgo = format(addDays(new Date(), -2), 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('vaccinations')
        .delete()
        .lt('scheduled_date', twoDaysAgo)
        .eq('completed', false);
      
      if (error) throw error;
      
      // Refresh vaccinations after cleanup
      fetchVaccinations();
      
    } catch (err) {
      console.error('Error cleaning up missed vaccinations:', err);
    }
  };
  
  // Function to fetch vaccinations (for refreshing data)
  const fetchVaccinations = async () => {
    try {
      setIsLoading(true);
      
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

      const today = format(new Date(), 'yyyy-MM-dd');
      
      if (filter === 'today') {
        query = query.eq('scheduled_date', today);
      } else if (filter === 'upcoming') {
        query = query.gt('scheduled_date', today).lt('scheduled_date', format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
      } else if (filter === 'overdue') {
        query = query.lt('scheduled_date', today);
      }

      if (filter !== 'all') {
        query = query.eq('completed', false);
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
        nextDue: item.scheduled_date,
        status: getReminderStatus(item.scheduled_date),
        completed: item.completed
      }));

      setVaccinations(formattedData);
    } catch (err) {
      console.error('Error refreshing vaccinations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getReminderStatus = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) return 'today';
    if (isPast(date)) return 'overdue';
    return 'upcoming';
  };

  // Function to mark a vaccination as completed
  const markCompleted = async (id: number) => {
    setCompletingVaccinations(prev => [...prev, id]);
    
    try {
      const { error } = await supabase
        .from('vaccinations')
        .update({ completed: true })
        .eq('id', id.toString()); // Convert number to string here
      
      if (error) throw error;
      
      toast({
        title: "Vaccination completed",
        description: "The vaccination has been marked as administered.",
      });
      
      // Refresh data
      await fetchVaccinations();
      
    } catch (err) {
      console.error('Error marking vaccination as completed:', err);
      toast({
        title: 'Error',
        description: 'Failed to update vaccination status.',
        variant: 'destructive',
      });
    } finally {
      setCompletingVaccinations(prev => prev.filter(vaccId => vaccId !== id));
    }
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
      
      // Format the date for display
      const formattedDate = format(new Date(vaccination.date), 'dd.MM.yyyy');
      
      // Create Turkish message with the exact format requested by the user
      const message = `sayin ${vaccination.ownerName}, sevgili ${vaccination.animalName}'in ${vaccination.vaccineName} aşı uygulama zamanı gelmiştir (${formattedDate}). Kliniğimize bekleriz. Sağlıklı günler dileriz.`;
      
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

  return { 
    vaccinations, 
    isLoading, 
    error, 
    sendingReminders, 
    sendReminder,
    markCompleted,
    completingVaccinations,
    refreshVaccinations: fetchVaccinations
  };
}
