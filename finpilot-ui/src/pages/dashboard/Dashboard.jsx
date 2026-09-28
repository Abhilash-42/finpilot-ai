import Greeting from "@/components/dashboard/Greeting";
import SummaryCards from "@/components/dashboard/SummaryCards";
import DashboardGrid from "@/components/dashboard/DashboardGrid";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <Greeting />
      <SummaryCards />
      <DashboardGrid />
    </div>
  );
}