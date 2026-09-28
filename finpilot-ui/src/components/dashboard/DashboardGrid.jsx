import AIInsight from "./AIInsight";
import CashFlowChart from "./CashFlowChart";
import FinancialHealth from "./FinancialHealth";
import GoalsWidget from "./GoalsWidget";
import RecentTransactions from "./RecentTransactions";

export default function DashboardGrid() {
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-12">

      {/* Cash Flow */}
      <div className="xl:col-span-8">
        <CashFlowChart />
      </div>

      {/* Financial Health */}
      <div className="xl:col-span-4">
        <FinancialHealth />
      </div>

      {/* AI Insight */}
      <div className="xl:col-span-8">
        <AIInsight />
      </div>

      {/* Goals */}
      <div className="xl:col-span-4">
        <GoalsWidget />
      </div>

      {/* Recent Transactions */}
      <div className="xl:col-span-12">
        <RecentTransactions />
      </div>

    </div>
  );
}