import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-orange-500",
  iconBg = "bg-orange-100",
  trend = "+0%",
  trendColor = "text-green-600",
  subtitle = "Compared to last month",
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
    >
      {/* Gradient Glow */}
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-200/20 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {value}
          </h2>

          <div className="mt-4 flex items-center gap-2">
            <TrendingUp
              size={16}
              className={trendColor}
            />

            <span className={`text-sm font-semibold ${trendColor}`}>
              {trend}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`rounded-2xl ${iconBg} p-4 transition-transform duration-300 group-hover:rotate-6`}
        >
          <Icon
            size={30}
            className={iconColor}
          />
        </div>
      </div>

      {/* Decorative Line */}
      <div className="mt-6 h-1 w-full rounded-full bg-slate-100">
        <div className="h-1 w-2/3 rounded-full bg-orange-500" />
      </div>
    </motion.div>
  );
}