
// Import the Supabase client and date-fns from correct Deno-compatible URLs
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { format, subDays } from "https://esm.sh/date-fns@3";
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the project URL and service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculate the date two days ago
    const twoDaysAgo = subDays(new Date(), 2);
    const formattedDate = format(twoDaysAgo, 'yyyy-MM-dd');

    console.log(`Running cleanup for vaccinations scheduled before ${formattedDate}`);

    // Find and delete missed vaccinations
    const { data, error } = await supabaseClient
      .from('vaccinations')
      .delete()
      .lt('scheduled_date', formattedDate)
      .eq('completed', false)
      .select();

    if (error) throw error;

    const deletedCount = data?.length || 0;
    
    console.log(`Cleanup completed. Removed ${deletedCount} missed vaccinations.`);
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleaned up ${deletedCount} missed vaccinations`,
        data: data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
