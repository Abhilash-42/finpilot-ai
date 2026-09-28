import api from "./api";

// Get income, expense and savings summary
export const getReportSummary = async (month, year) => {
  const params = {};

  if (month) {
    params.month = month;
  }

  if (year) {
    params.year = year;
  }

  const response = await api.get("/reports/summary", {
    params,
  });

  return response.data;
};

// Get expense totals grouped by category
export const getSpendingByCategory = async (month, year) => {
  const params = {};

  if (month) {
    params.month = month;
  }

  if (year) {
    params.year = year;
  }

  const response = await api.get(
    "/reports/spending-by-category",
    {
      params,
    }
  );

  return response.data;
};

// Get monthly income and expense data
export const getMonthlyReport = async (year) => {
  const response = await api.get("/reports/monthly", {
    params: {
      year,
    },
  });

  return response.data;
};

// Get recent transactions
export const getRecentReportTransactions = async (
  limit = 10
) => {
  const response = await api.get(
    "/reports/recent-transactions",
    {
      params: {
        limit,
      },
    }
  );

  return response.data;
};