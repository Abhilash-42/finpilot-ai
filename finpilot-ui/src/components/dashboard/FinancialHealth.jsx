import "react-circular-progressbar/dist/styles.css";

import { motion } from "framer-motion";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useDashboard from "@/hooks/useDashboard";

export default function FinancialHealth() {
  const { health } = useDashboard();

  if (health.isLoading) {
    return (
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-8">
          <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
        </CardContent>
      </Card>
    );
  }

  if (health.isError) {
    return (
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-8 text-red-500">
          Failed to load financial health.
        </CardContent>
      </Card>
    );
  }

  const data = health.data;

  const getColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor(data.score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Financial Health</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mx-auto w-44">
            <CircularProgressbar
              value={data.score}
              text={`${data.score}%`}
              styles={buildStyles({
                pathColor: color,
                textColor: color,
                trailColor: "#e5e7eb",
                strokeLinecap: "round",
              })}
            />
          </div>

          <div className="mt-6 text-center">
            <h3
              className="text-2xl font-bold"
              style={{ color }}
            >
              Grade {data.grade}
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              {data.summary}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-green-50 p-3">
                <p className="text-slate-500">Savings Rate</p>
                <p className="font-bold text-green-600">
                  {data.savings_rate}%
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-slate-500">Expense Ratio</p>
                <p className="font-bold text-red-600">
                  {data.expense_ratio}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}