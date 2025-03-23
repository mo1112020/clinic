
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalPatients: number;
  dogs: number;
  cats: number;
  birds: number;
  recentPatients: RecentPatient[];
}

export interface RecentPatient {
  id: string;
  name: string;
  animalType: string;
  ownerName: string;
  createdAt: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total counts by animal type
    const { data: countData, error: countError } = await supabase
      .from('animals')
      .select('animal_type', { count: 'exact', head: false })
      .eq('animal_type', 'dog');

    if (countError) throw countError;
    
    const { data: catCount, error: catError } = await supabase
      .from('animals')
      .select('animal_type', { count: 'exact', head: false })
      .eq('animal_type', 'cat');
      
    if (catError) throw catError;
    
    const { data: birdCount, error: birdError } = await supabase
      .from('animals')
      .select('animal_type', { count: 'exact', head: false })
      .eq('animal_type', 'bird');
      
    if (birdError) throw birdError;
    
    const { count: totalCount, error: totalError } = await supabase
      .from('animals')
      .select('*', { count: 'exact', head: true });
      
    if (totalError) throw totalError;

    // Get recent patients
    const { data: recentData, error: recentError } = await supabase
      .from('animals')
      .select(`
        id,
        name,
        animal_type,
        created_at,
        owners:owner_id (
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(4);

    if (recentError) throw recentError;

    // Transform the data for the dashboard
    const recentPatients: RecentPatient[] = recentData.map(animal => ({
      id: animal.id,
      name: animal.name,
      animalType: animal.animal_type,
      ownerName: animal.owners?.full_name || 'Unknown Owner',
      createdAt: animal.created_at || new Date().toISOString(),
    }));

    return {
      totalPatients: totalCount || 0,
      dogs: countData.length || 0,
      cats: catCount.length || 0,
      birds: birdCount.length || 0,
      recentPatients,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
