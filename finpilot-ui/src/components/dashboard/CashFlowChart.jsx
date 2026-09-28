import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDashboard from "@/hooks/useDashboard";

export default function CashFlowChart() {
  const { monthly } = useDashboard();

  if (monthly.isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Cash Flow</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
        </CardContent>
      </Card>
    );
  }

  if (monthly.isError) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Cash Flow</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-red-500">
            Failed to load chart data.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = monthly.data.map((item) => ({
    month: item.month.substring(0, 3),
    income: Number(item.income),
    expense: Number(item.expense),
  }));

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                fill="#22c55e33"
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fill="#ef444433"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}