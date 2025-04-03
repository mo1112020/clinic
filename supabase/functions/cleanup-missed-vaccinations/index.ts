
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.25.1';
import { format, subDays } from 'https://esm.sh/date-fns@2.30.0';

Deno.serve(async (req) => {
  try {
    // Create a Supabase client with the project URL and service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculate the date two days ago
    const twoDaysAgo = subDays(new Date(), 2);
    const formattedDate = format(twoDaysAgo, 'yyyy-MM-dd');

    // Find and delete missed vaccinations
    const { data, error } = await supabaseClient
      .from('vaccinations')
      .delete()
      .lt('scheduled_date', formattedDate)
      .eq('completed', false)
      .select();

    if (error) throw error;

    const deletedCount = data?.length || 0;
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleaned up ${deletedCount} missed vaccinations`,
        data: data
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error cleaning up missed vaccinations:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
