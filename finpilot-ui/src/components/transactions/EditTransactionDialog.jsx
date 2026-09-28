import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getAccounts } from "@/services/accountService";
import { getCategories } from "@/services/categoryService";

export default function EditTransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSubmit,
  isSaving = false,
}) {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [form, setForm] = useState({
    account_id: "",
    category_id: "",
    amount: "",
    transaction_type: "Expense",
    description: "",
    transaction_date: "",
  });

  // Load transaction data into the form
  useEffect(() => {
    if (!open || !transaction) return;

    let formattedDate = "";

    if (transaction.transaction_date) {
      formattedDate = new Date(
        transaction.transaction_date
      )
        .toISOString()
        .split("T")[0];
    }

    setForm({
      account_id: transaction.account_id || "",
      category_id: transaction.category_id || "",
      amount: transaction.amount || "",
      transaction_type:
        transaction.transaction_type || "Expense",
      description: transaction.description || "",
      transaction_date: formattedDate,
    });
  }, [open, transaction]);

  // Load accounts and categories
  useEffect(() => {
    if (!open) return;

    const loadAccounts = async () => {
      try {
        setLoadingAccounts(true);

        const data = await getAccounts();

        setAccounts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to load accounts:",
          error
        );
      } finally {
        setLoadingAccounts(false);
      }
    };

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const data = await getCategories();

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadAccounts();
    loadCategories();
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "transaction_type"
        ? { category_id: "" }
        : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!transaction?.id) {
      alert("Transaction not found.");
      return;
    }

    if (!form.account_id) {
      alert("Please select an account.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!form.transaction_date) {
      alert("Please select a transaction date.");
      return;
    }

    const payload = {
      account_id: form.account_id,
      amount: Number(form.amount),
      transaction_type: form.transaction_type,
      description:
        form.description.trim() || null,
      transaction_date: new Date(
        `${form.transaction_date}T00:00:00`
      ).toISOString(),
    };

    if (
      form.category_id &&
      form.transaction_type !== "Transfer"
    ) {
      payload.category_id = form.category_id;
    } else {
      payload.category_id = null;
    }

    onSubmit(transaction.id, payload);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.type?.toLowerCase() ===
      form.transaction_type?.toLowerCase()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Edit Transaction
          </DialogTitle>

          <DialogDescription>
            Update the details of this transaction.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Account */}
          <div className="space-y-2">
            <Label htmlFor="edit-transaction-account">
              Account
            </Label>

            <select
              id="edit-transaction-account"
              name="account_id"
              value={form.account_id}
              onChange={handleChange}
              disabled={
                loadingAccounts || isSaving
              }
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">
                {loadingAccounts
                  ? "Loading accounts..."
                  : "Select account"}
              </option>

              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.id}
                >
                  {account.name}
                  {account.currency
                    ? ` (${account.currency})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="edit-transaction-type">
              Transaction Type
            </Label>

            <select
              id="edit-transaction-type"
              name="transaction_type"
              value={form.transaction_type}
              onChange={handleChange}
              disabled={isSaving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Income">
                Income
              </option>

              <option value="Expense">
                Expense
              </option>

              <option value="Transfer">
                Transfer
              </option>
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="edit-transaction-amount">
              Amount
            </Label>

            <Input
              id="edit-transaction-amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              disabled={isSaving}
              required
            />
          </div>

          {/* Category */}
          {form.transaction_type !==
            "Transfer" && (
            <div className="space-y-2">
              <Label htmlFor="edit-transaction-category">
                Category
                <span className="text-slate-400 font-normal">
                  {" "}
                  (optional)
                </span>
              </Label>

              <select
                id="edit-transaction-category"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                disabled={
                  isSaving ||
                  loadingCategories
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {filteredCategories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-transaction-description">
              Description
            </Label>

            <Input
              id="edit-transaction-description"
              name="description"
              placeholder="e.g. Monthly salary"
              value={form.description}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="edit-transaction-date">
              Transaction Date
            </Label>

            <Input
              id="edit-transaction-date"
              name="transaction_date"
              type="date"
              value={form.transaction_date}
              onChange={handleChange}
              disabled={isSaving}
              required
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSaving ||
                loadingAccounts ||
                loadingCategories ||
                accounts.length === 0
              }
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}