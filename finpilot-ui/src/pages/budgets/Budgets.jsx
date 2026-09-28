import { useEffect, useState } from "react";

import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "@/services/budgetService";

import AddBudgetDialog from "@/components/budgets/AddBudgetDialog";
import EditBudgetDialog from "@/components/budgets/EditBudgetDialog";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddDialog, setShowAddDialog] =
    useState(false);

  const [showEditDialog, setShowEditDialog] =
    useState(false);

  const [selectedBudget, setSelectedBudget] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBudgets();

      setBudgets(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load budgets:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to load budgets.";

      setError(
        Array.isArray(message)
          ? message
              .map((item) => item.msg)
              .join(", ")
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // -----------------------------
  // CREATE
  // -----------------------------
  const handleCreateBudget = async (
    budgetData
  ) => {
    try {
      setSaving(true);
      setError("");

      await createBudget(budgetData);

      setShowAddDialog(false);

      await fetchBudgets();
    } catch (err) {
      console.error(
        "Failed to create budget:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to create budget.";

      setError(
        Array.isArray(message)
          ? message
              .map((item) => item.msg)
              .join(", ")
          : message
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // OPEN EDIT
  // -----------------------------
  const handleEditClick = (budget) => {
    setSelectedBudget(budget);
    setShowEditDialog(true);
  };

  // -----------------------------
  // UPDATE
  // -----------------------------
  const handleUpdateBudget = async (
    budgetData
  ) => {
    if (!selectedBudget?.id) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateBudget(
        selectedBudget.id,
        budgetData
      );

      setShowEditDialog(false);
      setSelectedBudget(null);

      await fetchBudgets();
    } catch (err) {
      console.error(
        "Failed to update budget:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to update budget.";

      setError(
        Array.isArray(message)
          ? message
              .map((item) => item.msg)
              .join(", ")
          : message
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const handleDeleteBudget = async (budget) => {
    if (!budget?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the budget for ${
        budget.category_name ||
        budget.category ||
        "this category"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBudget(budget.id);

      await fetchBudgets();
    } catch (err) {
      console.error(
        "Failed to delete budget:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to delete budget.";

      setError(
        Array.isArray(message)
          ? message
              .map((item) => item.msg)
              .join(", ")
          : message
      );
    }
  };

  // -----------------------------
  // HELPERS
  // -----------------------------
  const formatAmount = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      months[Number(month) - 1] || "-"
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Budgets
          </h1>

          <p className="text-slate-500 mt-2">
            Set and manage your monthly spending
            limits.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowAddDialog(true)
          }
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Budget
        </button>
      </div>

      {/* Add Dialog */}
      <AddBudgetDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleCreateBudget}
        isSaving={saving}
      />

      {/* Edit Dialog */}
      <EditBudgetDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);

          if (!open) {
            setSelectedBudget(null);
          }
        }}
        budget={selectedBudget}
        onSubmit={handleUpdateBudget}
        isSaving={saving}
      />

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">
            Loading budgets...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        budgets.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-800">
              No budgets yet
            </h2>

            <p className="text-slate-500 mt-2">
              Create your first budget to start
              tracking your spending.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowAddDialog(true)
              }
              className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold"
            >
              Create Budget
            </button>
          </div>
        )}

      {/* Budget Cards */}
      {!loading &&
        budgets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {budget.category_name ||
                        budget.category ||
                        "Budget"}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {getMonthName(
                        budget.month
                      )}{" "}
                      {budget.year}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-slate-500">
                    Budget
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatAmount(
                      budget.amount
                    )}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Monthly limit
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      handleEditClick(
                        budget
                      )
                    }
                    className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteBudget(
                        budget
                      )
                    }
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}