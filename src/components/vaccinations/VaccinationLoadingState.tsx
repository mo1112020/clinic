
import { Loader2 } from 'lucide-react';

export const VaccinationLoadingState = () => {
  return (
    <div className="text-center py-10">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
      <p className="text-muted-foreground">Loading vaccination reminders...</p>
    </div>
  );
};
