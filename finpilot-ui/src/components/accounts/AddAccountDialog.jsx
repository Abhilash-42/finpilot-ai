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

export default function AddAccountDialog({
  open,
  onOpenChange,
  onSubmit,
  isSaving = false,
}) {
  const [form, setForm] = useState({
    name: "",
    account_type: "SAVINGS",
    balance: "",
    currency: "INR",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        account_type: "SAVINGS",
        balance: "",
        currency: "INR",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    onSubmit({
      name: form.name.trim(),
      account_type: form.account_type,
      balance: Number(form.balance || 0),
      currency: form.currency.trim() || "INR",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>

          <DialogDescription>
            Add a new bank or financial account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="account-name">
              Account Name
            </Label>

            <Input
              id="account-name"
              name="name"
              placeholder="e.g. SBI"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-type">
              Account Type
            </Label>

            <select
              id="account-type"
              name="account_type"
              value={form.account_type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="SAVINGS">Savings</option>
              <option value="CURRENT">Current</option>
              <option value="CASH">Cash</option>
              <option value="CREDIT">Credit</option>
              <option value="INVESTMENT">Investment</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-balance">
              Balance
            </Label>

            <Input
              id="account-balance"
              name="balance"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={form.balance}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-currency">
              Currency
            </Label>

            <Input
              id="account-currency"
              name="currency"
              placeholder="INR"
              value={form.currency}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Adding..." : "Add Account"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}