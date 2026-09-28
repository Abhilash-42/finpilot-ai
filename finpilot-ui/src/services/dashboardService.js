import api from "./api";

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

export const getMonthlyAnalytics = async () => {
  const response = await api.get("/dashboard/monthly");
  return response.data;
};

export const getRecentTransactions = async () => {
  const response = await api.get("/dashboard/recent");
  return response.data;
};

export const getFinancialHealth = async () => {
  const response = await api.get("/dashboard/health-score");
  return response.data;
};

export const getCategoryAnalysis = async () => {
  const response = await api.get("/dashboard/category-analysis");
  return response.data;
};