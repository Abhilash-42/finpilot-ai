import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function AIInsight() {
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

              <h2 className="text-xl font-bold">

                AI Insight

              </h2>

              <p className="text-orange-100">

                Personalized Recommendation

              </p>

            </div>

          </div>

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

            <div className="mb-3 flex items-center gap-2">

              <TrendingUp size={20} />

              <span className="font-semibold">

                Spending Analysis

              </span>

            </div>

            <p className="leading-7">

              Your
              <strong> Food expenses</strong>
              increased by
              <strong> 18%</strong>
              compared to last month.

            </p>

          </div>

          <div className="mt-6 rounded-2xl bg-white/10 p-5">

            <p className="text-orange-50">

              💡 If you reduce food spending by

              <strong> ₹2,000/month</strong>

              you'll reach your

              <strong> Laptop Goal</strong>

              nearly

              <strong> 21 days earlier.</strong>

            </p>

          </div>

          <Button
            className="mt-7 rounded-xl bg-white text-orange-600 hover:bg-orange-50"
          >
            View Detailed Analysis

            <ArrowRight
              className="ml-2"
              size={18}
            />

          </Button>

        </CardContent>

      </Card>
    </motion.div>
  );
}