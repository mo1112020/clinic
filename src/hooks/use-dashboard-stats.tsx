
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, DashboardStats } from '@/services/dashboard/get-dashboard-stats';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });
}
