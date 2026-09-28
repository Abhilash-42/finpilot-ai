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

export default function EditAccountDialog({
  open,
  onOpenChange,
  account,
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
    if (account) {
      setForm({
        name: account.name || "",
        account_type: account.account_type || "SAVINGS",
        balance: account.balance ?? "",
        currency: account.currency || "INR",
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!account?.id || !form.name.trim()) {
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
          <DialogTitle>Edit Account</DialogTitle>

          <DialogDescription>
            Update your account information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="edit-account-name">
              Account Name
            </Label>

            <Input
              id="edit-account-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-account-type">
              Account Type
            </Label>

            <select
              id="edit-account-type"
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
            <Label htmlFor="edit-account-balance">
              Balance
            </Label>

            <Input
              id="edit-account-balance"
              name="balance"
              type="number"
              min="0"
              step="0.01"
              value={form.balance}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-account-currency">
              Currency
            </Label>

            <Input
              id="edit-account-currency"
              name="currency"
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
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}