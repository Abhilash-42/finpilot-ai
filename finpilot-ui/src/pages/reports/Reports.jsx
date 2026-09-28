import { useEffect, useState } from "react";

import {
  getReportSummary,
  getSpendingByCategory,
  getMonthlyReport,
} from "../../services/reportService";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [categorySpending, setCategorySpending] =
    useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [selectedYear, setSelectedYear] =
    useState(currentYear);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryData,
        categoryData,
        monthlyReportData,
      ] = await Promise.all([
        getReportSummary(
          selectedMonth,
          selectedYear
        ),
        getSpendingByCategory(
          selectedMonth,
          selectedYear
        ),
        getMonthlyReport(selectedYear),
      ]);

      setSummary(summaryData);

      setCategorySpending(
        Array.isArray(categoryData)
          ? categoryData
          : []
      );

      setMonthlyData(
        Array.isArray(monthlyReportData)
          ? monthlyReportData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load reports:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Unable to load reports.";

      setError(
        Array.isArray(message)
          ? message
              .map((item) => item.msg)
              .join(", ")
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedMonth, selectedYear]);

  const formatAmount = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[month - 1] || "-";
  };

  const totalCategorySpending =
    categorySpending.reduce(
      (total, item) =>
        total + Number(item.total || 0),
      0
    );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="text-slate-500 mt-2">
            Understand your income, expenses and
            spending habits.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(
                Number(event.target.value)
              )
            }
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
          >
            {Array.from(
              { length: 12 },
              (_, index) => index + 1
            ).map((month) => (
              <option
                key={month}
                value={month}
              >
                {getMonthName(month)}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(
                Number(event.target.value)
              )
            }
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
          >
            {[currentYear - 2, currentYear - 1, currentYear].map(
              (year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">
            Loading reports...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
          <p className="text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchReports}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">
                Total Income
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatAmount(
                  summary?.total_income
                )}
              </p>

              <p className="text-sm text-green-600 mt-2">
                Money received
              </p>
            </div>

            {/* Expense */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">
                Total Expense
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatAmount(
                  summary?.total_expense
                )}
              </p>

              <p className="text-sm text-red-500 mt-2">
                Money spent
              </p>
            </div>

            {/* Savings */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">
                Net Savings
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatAmount(
                  summary?.net_savings
                )}
              </p>

              <p className="text-sm text-blue-600 mt-2">
                Income minus expenses
              </p>
            </div>
          </div>

          {/* Transaction count */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {getMonthName(selectedMonth)}{" "}
                  {selectedYear}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Financial activity for the
                  selected month
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  {summary?.transaction_count ||
                    0}
                </p>

                <p className="text-sm text-slate-500">
                  Transactions
                </p>
              </div>
            </div>
          </div>

          {/* Spending by Category */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Spending by Category
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Where your money went this
                  month
                </p>
              </div>

              <p className="font-semibold text-slate-900">
                {formatAmount(
                  totalCategorySpending
                )}
              </p>
            </div>

            {categorySpending.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No expense data for this
                  month.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {categorySpending.map(
                  (item) => {
                    const amount = Number(
                      item.total || 0
                    );

                    const percentage =
                      totalCategorySpending >
                      0
                        ? (amount /
                            totalCategorySpending) *
                          100
                        : 0;

                    return (
                      <div
                        key={
                          item.category_id
                        }
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-700">
                            {item.category_name ||
                              "Uncategorized"}
                          </span>

                          <span className="text-sm text-slate-500">
                            {formatAmount(amount)}
                          </span>
                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {percentage.toFixed(
                            1
                          )}
                          %
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Monthly Report */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Monthly Income & Expense
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Financial activity during{" "}
                {selectedYear}
              </p>
            </div>

            {monthlyData.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No monthly data available.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {monthlyData.map(
                  (item) => {
                    const income = Number(
                      item.income || 0
                    );

                    const expense = Number(
                      item.expense || 0
                    );

                    const maxValue = Math.max(
                      income,
                      expense,
                      1
                    );

                    return (
                      <div
                        key={item.month}
                        className="border-b border-slate-100 pb-5 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-slate-700">
                            {getMonthName(
                              item.month
                            )}
                          </span>

                          <div className="flex gap-4 text-sm">
                            <span className="text-green-600">
                              Income:{" "}
                              {formatAmount(
                                income
                              )}
                            </span>

                            <span className="text-red-500">
                              Expense:{" "}
                              {formatAmount(
                                expense
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-16 text-xs text-slate-400">
                              Income
                            </span>

                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                  width: `${
                                    (income /
                                      maxValue) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="w-16 text-xs text-slate-400">
                              Expense
                            </span>

                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                  width: `${
                                    (expense /
                                      maxValue) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}