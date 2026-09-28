import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useDashboard from "@/hooks/useDashboard";

export default function RecentTransactions() {
  const { recent } = useDashboard();

  if (recent.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recent.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-red-500">
            Failed to load transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const transactions = recent.data;

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">

          {transactions.map((item) => {
            const income = item.transaction_type === "Income";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl p-3 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">

                  <div
                    className={`rounded-full p-3 ${
                      income
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {income ? (
                      <ArrowDownLeft
                        size={18}
                        className="text-green-600"
                      />
                    ) : (
                      <ArrowUpRight
                        size={18}
                        className="text-red-600"
                      />
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      {item.category_name}
                    </h4>

                    <p className="text-sm text-slate-500">
                      {item.account_name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {new Date(
                        item.transaction_date
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                </div>

                <div className="text-right">

                  <p
                    className={`font-bold ${
                      income
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {income ? "+" : "-"}₹
                    {Number(item.amount).toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs text-slate-500">
                    {item.transaction_type}
                  </p>

                </div>
              </div>
            );
          })}

        </div>
      </CardContent>
    </Card>
  );
}