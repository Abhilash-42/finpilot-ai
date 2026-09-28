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

import { getCategories } from "@/services/categoryService";

export default function AddBudgetDialog({
  open,
  onOpenChange,
  onSubmit,
  isSaving = false,
}) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(false);

  const currentDate = new Date();

  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  useEffect(() => {
    if (!open) return;

    setForm({
      category_id: "",
      amount: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const data = await getCategories();

        const expenseCategories = (
          Array.isArray(data) ? data : []
        ).filter(
          (category) =>
            category.type?.toLowerCase() ===
            "expense"
        );

        setCategories(expenseCategories);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "month" || name === "year"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.category_id) {
      alert("Please select a category.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    if (
      !form.month ||
      form.month < 1 ||
      form.month > 12
    ) {
      alert("Please select a valid month.");
      return;
    }

    if (
      !form.year ||
      form.year < 2000 ||
      form.year > 2100
    ) {
      alert("Please enter a valid year.");
      return;
    }

    const payload = {
      category_id: form.category_id,
      amount: Number(form.amount),
      month: Number(form.month),
      year: Number(form.year),
    };

    onSubmit(payload);
  };

  const monthNames = [
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Add Budget
          </DialogTitle>

          <DialogDescription>
            Set a spending limit for a category and
            month.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="budget-category">
              Category
            </Label>

            <select
              id="budget-category"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              disabled={
                loadingCategories || isSaving
              }
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {!loadingCategories &&
              categories.length === 0 && (
                <p className="text-sm text-red-500">
                  No expense categories found.
                </p>
              )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="budget-amount">
              Budget Amount
            </Label>

            <Input
              id="budget-amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="5000.00"
              value={form.amount}
              onChange={handleChange}
              disabled={isSaving}
              required
            />
          </div>

          {/* Month */}
          <div className="space-y-2">
            <Label htmlFor="budget-month">
              Month
            </Label>

            <select
              id="budget-month"
              name="month"
              value={form.month}
              onChange={handleChange}
              disabled={isSaving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {monthNames.map(
                (month, index) => (
                  <option
                    key={month}
                    value={index + 1}
                  >
                    {month}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="budget-year">
              Year
            </Label>

            <Input
              id="budget-year"
              name="year"
              type="number"
              min="2000"
              max="2100"
              value={form.year}
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
                loadingCategories ||
                categories.length === 0
              }
            >
              {isSaving
                ? "Creating..."
                : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}