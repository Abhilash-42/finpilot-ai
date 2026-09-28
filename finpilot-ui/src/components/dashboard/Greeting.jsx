import { motion } from "framer-motion";

export default function Greeting() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <h1 className="text-4xl font-bold">
        {greeting} 👋
      </h1>

      <p className="mt-2 text-gray-500">
        Welcome back! Here's your financial overview.
      </p>

      <p className="mt-1 text-sm text-gray-400">
        {today}
      </p>
    </motion.div>
  );
}