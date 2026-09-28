import { useQuery } from "@tanstack/react-query";

import {
  getDashboardSummary,
  getMonthlyAnalytics,
  getRecentTransactions,
  getFinancialHealth,
  getCategoryAnalysis,
} from "@/services/dashboardService";

export default function useDashboard() {
  const summary = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  const monthly = useQuery({
    queryKey: ["dashboard-monthly"],
    queryFn: getMonthlyAnalytics,
  });

  const recent = useQuery({
    queryKey: ["dashboard-recent"],
    queryFn: getRecentTransactions,
  });

  const health = useQuery({
    queryKey: ["dashboard-health"],
    queryFn: getFinancialHealth,
  });

  const category = useQuery({
    queryKey: ["dashboard-category"],
    queryFn: getCategoryAnalysis,
  });

  return {
    summary,
    monthly,
    recent,
    health,
    category,
  };
}