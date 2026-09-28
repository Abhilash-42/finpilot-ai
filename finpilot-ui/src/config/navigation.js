import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Target,
  PiggyBank,
  BarChart3,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Accounts",
    icon: Wallet,
    path: "/accounts",
  },
  {
    title: "Transactions",
    icon: ArrowLeftRight,
    path: "/transactions",
  },
  {
    title: "Goals",
    icon: Target,
    path: "/goals",
  },
  {
    title: "Budgets",
    icon: PiggyBank,
    path: "/budgets",
  },
  {
    title: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];