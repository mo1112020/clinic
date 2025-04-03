
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, isAfter, parseISO, subDays } from 'date-fns';

interface CleanupLogProps {
  onCleanupComplete?: () => void;
}

const VaccinationCleanupLog: React.FC<CleanupLogProps> = ({ onCleanupComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [missedCount, setMissedCount] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    countMissedVaccinations();
  }, []);

  const countMissedVaccinations = async () => {
    try {
      // Calculate the date two days ago
      const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
      
      const { data, error, count } = await supabase
        .from('vaccinations')
        .select('*', { count: 'exact' })
        .lt('scheduled_date', twoDaysAgo)
        .eq('completed', false);
      
      if (error) throw error;
      
      setMissedCount(count || 0);
      
    } catch (err) {
      console.error('Error counting missed vaccinations:', err);
    }
  };
  
  const triggerManualCleanup = async () => {
    setIsLoading(true);
    
    try {
      // Calculate the date two days ago
      const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
      
      // Delete missed vaccinations
      const { error, count } = await supabase
        .from('vaccinations')
        .delete({ count: 'exact' })
        .lt('scheduled_date', twoDaysAgo)
        .eq('completed', false);
      
      if (error) throw error;
      
      toast({
        title: "Cleanup completed",
        description: `${count} missed vaccinations have been removed.`,
      });
      
      setMissedCount(0);
      
      if (onCleanupComplete) {
        onCleanupComplete();
      }
      
    } catch (err) {
      console.error('Error cleaning up missed vaccinations:', err);
      toast({
        title: "Cleanup failed",
        description: "Failed to remove missed vaccinations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Missed Vaccination Cleanup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Vaccinations scheduled more than 2 days ago that weren't marked as completed are automatically removed from the system.
        </p>
        {missedCount !== null && (
          <p className="mt-2">
            <span className="font-medium">{missedCount}</span> missed vaccination{missedCount !== 1 ? 's' : ''} eligible for cleanup.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto"
          onClick={triggerManualCleanup}
          disabled={isLoading || missedCount === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cleaning up...
            </>
          ) : (
            <>
              <Trash className="mr-2 h-4 w-4" />
              Cleanup Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VaccinationCleanupLog;
