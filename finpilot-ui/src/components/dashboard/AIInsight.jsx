
        import { motion } from "framer-motion";
        import { Sparkles, TrendingDown, Wallet } from "lucide-react";

        import { Card, CardContent } from "@/components/ui/card";
        import useDashboard from "@/hooks/useDashboard";

        const formatINR = (value) =>
          `₹${Number(value ?? 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}`;

        export default function AIInsight() {
          const { summary, category } = useDashboard();

          const isLoading = summary.isLoading || category.isLoading;
          const hasError = summary.isError || category.isError;

          const categories = Array.isArray(category.data) ? category.data : [];
          const topCategory = [...categories].sort(
            (a, b) => Number(b.amount ?? 0) - Number(a.amount ?? 0)
          )[0];

          let title = "Your finance snapshot";
          let insight = "Add accounts and record transactions to start seeing insights based on your own financial activity.";

          if (topCategory && Number(topCategory.amount) > 0) {
            title = "Highest recorded expense category";
            insight = `${topCategory.category} has the highest recorded expense total at ${formatINR(topCategory.amount)}. Review the transactions in this category to decide whether any spending changes make sense for you.`;
          } else if (
            summary.data &&
            Number(summary.data.total_income ?? 0) > 0 &&
            Number(summary.data.total_expense ?? 0) === 0
          ) {
            title = "No expenses recorded yet";
            insight = "Your recorded income is available, but no expense transactions have been recorded yet. Add your expenses to make the spending analysis more useful.";
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white shadow-xl">
                <CardContent className="p-7">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Finance Insight</h2>
                      <p className="text-orange-100">Based on your saved data</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">
                    <div className="mb-3 flex items-center gap-2">
                      {topCategory ? <TrendingDown size={20} /> : <Wallet size={20} />}
                      <span className="font-semibold">
                        {isLoading ? "Loading your data…" : hasError ? "Insight unavailable" : title}
                      </span>
                    </div>
                    <p className="leading-7">
                      {hasError
                        ? "We couldn't load your financial summary. Please refresh the dashboard and try again."
                        : isLoading
                          ? "Fetching your latest account and transaction information."
                          : insight}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        }
