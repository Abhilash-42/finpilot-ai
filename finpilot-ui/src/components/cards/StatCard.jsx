import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-orange-500",
  iconBg = "bg-orange-100",
  subtitle,
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-200/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-3 whitespace-nowrap text-2xl font-bold tracking-tight tabular-nums sm:text-3xl xl:text-2xl 2xl:text-3xl">
            {value}
          </h2>
          {subtitle && (
            <p className="mt-4 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        <div
          className={`shrink-0 rounded-2xl ${iconBg} p-4 transition-transform duration-300 group-hover:rotate-6`}
        >
          <Icon size={30} className={iconColor} />
        </div>
      </div>
    </motion.div>
  );
}
