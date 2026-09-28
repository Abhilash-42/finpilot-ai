import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "@/layouts/DashboardLayout";

import Dashboard from "@/pages/dashboard/Dashboard";
import Accounts from "@/pages/accounts/Accounts";
import Transactions from "@/pages/transactions/Transactions";
import Goals from "@/pages/goals/Goals";
import Budgets from "@/pages/budgets/Budgets";
import Reports from "@/pages/reports/Reports";
import Settings from "@/pages/settings/Settings";
import AIAssistant from "@/pages/ai/AIAssistant";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/accounts"
              element={<Accounts />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/goals"
              element={<Goals />}
            />

            <Route
              path="/budgets"
              element={<Budgets />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="/ai"
              element={<AIAssistant />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}