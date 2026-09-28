import { useEffect, useState } from "react";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/transactionService";

import AddTransactionDialog from "../../components/transactions/AddTransactionDialog";
import EditTransactionDialog from "../../components/transactions/EditTransactionDialog";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  // Delete
  const [deletingId, setDeletingId] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTransactions();

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);

      setError("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ----------------------------------------
  // ADD TRANSACTION
  // ----------------------------------------

  const handleAddTransaction = async (transactionData) => {
    try {
      setSaving(true);
      setError("");

      await createTransaction(transactionData);

      setShowAddDialog(false);

      await fetchTransactions();
    } catch (err) {
      console.error(
        "Failed to create transaction:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to create transaction.";

      setError(
        Array.isArray(message)
          ? message.map((item) => item.msg).join(", ")
          : message
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // OPEN EDIT
  // ----------------------------------------

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowEditDialog(true);
  };

  // ----------------------------------------
  // UPDATE TRANSACTION
  // ----------------------------------------

  const handleUpdateTransaction = async (
    transactionId,
    transactionData
  ) => {
    try {
      setSaving(true);
      setError("");

      await updateTransaction(
        transactionId,
        transactionData
      );

      setShowEditDialog(false);
      setSelectedTransaction(null);

      await fetchTransactions();
    } catch (err) {
      console.error(
        "Failed to update transaction:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to update transaction.";

      setError(
        Array.isArray(message)
          ? message.map((item) => item.msg).join(", ")
          : message
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // DELETE TRANSACTION
  // ----------------------------------------

  const handleDeleteTransaction = async (
    transactionId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(transactionId);
      setError("");

      await deleteTransaction(transactionId);

      await fetchTransactions();
    } catch (err) {
      console.error(
        "Failed to delete transaction:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to delete transaction.";

      setError(
        Array.isArray(message)
          ? message.map((item) => item.msg).join(", ")
          : message
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ----------------------------------------
  // HELPERS
  // ----------------------------------------

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="p-8">
      {/* ---------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------- */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Transactions
          </h1>

          <p className="text-slate-500 mt-2">
            Manage and track your income and expenses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddDialog(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* ---------------------------------- */}
      {/* ADD DIALOG */}
      {/* ---------------------------------- */}

      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddTransaction}
        isSaving={saving}
      />

      {/* ---------------------------------- */}
      {/* EDIT DIALOG */}
      {/* ---------------------------------- */}

      <EditTransactionDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);

          if (!open) {
            setSelectedTransaction(null);
          }
        }}
        transaction={selectedTransaction}
        onSubmit={handleUpdateTransaction}
        isSaving={saving}
      />

      {/* ---------------------------------- */}
      {/* ERROR */}
      {/* ---------------------------------- */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ---------------------------------- */}
      {/* LOADING */}
      {/* ---------------------------------- */}

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">
            Loading transactions...
          </p>
        </div>
      )}

      {/* ---------------------------------- */}
      {/* EMPTY */}
      {/* ---------------------------------- */}

      {!loading &&
        !error &&
        transactions.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500">
              No transactions found.
            </p>
          </div>
        )}

      {/* ---------------------------------- */}
      {/* TABLE */}
      {/* ---------------------------------- */}

      {!loading && transactions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Description
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Account
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Type
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Date
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                    Amount
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const transactionType =
                    transaction.transaction_type?.toLowerCase();

                  const isIncome =
                    transactionType === "income";

                  const isTransfer =
                    transactionType === "transfer";

                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
                    >
                      {/* Description */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {transaction.description ||
                            "No description"}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-slate-600 capitalize">
                        {transaction.category_name ||
                          "-"}
                      </td>

                      {/* Account */}
                      <td className="px-6 py-4 text-slate-600">
                        {transaction.account_name ||
                          "-"}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            isIncome
                              ? "bg-green-100 text-green-700"
                              : isTransfer
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.transaction_type ||
                            "-"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(
                          transaction.transaction_date
                        )}
                      </td>

                      {/* Amount */}
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          isIncome
                            ? "text-green-600"
                            : isTransfer
                            ? "text-blue-600"
                            : "text-red-600"
                        }`}
                      >
                        {isIncome
                          ? "+"
                          : isTransfer
                          ? ""
                          : "-"}

                        {formatAmount(
                          transaction.amount
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() =>
                              handleEditClick(
                                transaction
                              )
                            }
                            disabled={
                              deletingId ===
                              transaction.id
                            }
                            className="px-3 py-2 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-sm font-medium"
                          >
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteTransaction(
                                transaction.id
                              )
                            }
                            disabled={
                              deletingId ===
                              transaction.id
                            }
                            className="px-3 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-medium"
                          >
                            {deletingId ===
                            transaction.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}