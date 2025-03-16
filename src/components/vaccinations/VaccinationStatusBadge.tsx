
import { Badge } from "@/components/ui/badge";

type VaccinationStatus = 'today' | 'upcoming' | 'overdue';

interface VaccinationStatusBadgeProps {
  status: VaccinationStatus;
}

export const VaccinationStatusBadge = ({ status }: VaccinationStatusBadgeProps) => {
  const getStatusColor = (status: VaccinationStatus) => {
    switch (status) {
      case 'today':
        return 'bg-amber-500 text-white';
      case 'overdue':
        return 'bg-destructive text-white';
      case 'upcoming':
        return 'bg-primary text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
