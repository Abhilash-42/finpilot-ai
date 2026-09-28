import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

import StatCard from "@/components/cards/StatCard";
import useDashboard from "@/hooks/useDashboard";

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
        Failed to load dashboard summary.
      </div>
    );
  }

  const data = summary.data;

  const cards = [
    {
      title: "Total Balance",
      value: `₹${Number(data.total_balance).toLocaleString("en-IN")}`,
      icon: Wallet,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-100",
      trend: "+12.4%",
      trendColor: "text-green-600",
    },
    {
      title: "Income",
      value: `₹${Number(data.total_income).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      trend: "+8.2%",
      trendColor: "text-green-600",
    },
    {
      title: "Expenses",
      value: `₹${Number(data.total_expense).toLocaleString("en-IN")}`,
      icon: TrendingDown,
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
      trend: "-3.1%",
      trendColor: "text-red-500",
    },
    {
      title: "Savings",
      value: `₹${Number(data.net_savings).toLocaleString("en-IN")}`,
      icon: PiggyBank,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      trend: "+15.7%",
      trendColor: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          {...card}
        />
      ))}
    </div>
  );
}