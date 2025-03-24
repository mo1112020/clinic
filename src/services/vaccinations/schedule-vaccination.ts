
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface ScheduleVaccinationData {
  animalId: string;
  vaccineName: string;
  scheduledDate: Date;
  notes?: string;
}

export async function scheduleVaccination(data: ScheduleVaccinationData) {
  try {
    const formattedDate = format(data.scheduledDate, 'yyyy-MM-dd');
    
    // Log the data being sent to Supabase
    console.log('Scheduling vaccination with data:', {
      animal_id: data.animalId,
      vaccine_name: data.vaccineName,
      scheduled_date: formattedDate
    });
    
    const { data: vaccination, error } = await supabase
      .from('vaccinations')
      .insert({
        animal_id: data.animalId,
        vaccine_name: data.vaccineName,
        scheduled_date: formattedDate,
        completed: false,
        notification_sent: false
      })
      .select()
      .single();
      
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return vaccination;
  } catch (error) {
    console.error('Error scheduling vaccination:', error);
    throw error;
  }
}
