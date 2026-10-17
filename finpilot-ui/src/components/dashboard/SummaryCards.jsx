
        import {
          Wallet,
          TrendingUp,
          TrendingDown,
          PiggyBank,
        } from "lucide-react";

        import StatCard from "@/components/cards/StatCard";
        import useDashboard from "@/hooks/useDashboard";

        const formatINR = (value) =>
          `₹${Number(value ?? 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
          })}`;

        export default function SummaryCards() {
          const { summary } = useDashboard();

          if (summary.isLoading) {
            return (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-3xl bg-slate-200"
                  />
                ))}
              </div>
            );
          }

          if (summary.isError) {
            return (
              <div className="rounded-2xl bg-red-50 p-6 text-red-600">
                Failed to load dashboard summary. Please refresh or sign in again.
              </div>
            );
          }

          const data = summary.data ?? {};
          const cards = [
            {
              title: "Total Balance",
              value: formatINR(data.total_balance),
              subtitle: "Sum of your saved account balances",
              icon: Wallet,
              iconColor: "text-orange-500",
              iconBg: "bg-orange-100",
            },
            {
              title: "Income",
              value: formatINR(data.total_income),
              subtitle: "Income transactions recorded",
              icon: TrendingUp,
              iconColor: "text-green-600",
              iconBg: "bg-green-100",
            },
            {
              title: "Expenses",
              value: formatINR(data.total_expense),
              subtitle: "Expense transactions recorded",
              icon: TrendingDown,
              iconColor: "text-red-500",
              iconBg: "bg-red-100",
            },
            {
              title: "Net Savings",
              value: formatINR(data.net_savings),
              subtitle: "Recorded income minus expenses",
              icon: PiggyBank,
              iconColor: "text-blue-600",
              iconBg: "bg-blue-100",
            },
          ];

          return (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </div>
          );
        }
