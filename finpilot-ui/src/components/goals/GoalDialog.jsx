import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GoalDialog({
  open,
  onOpenChange,
  onSubmit,
  goal,
  isSaving = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      target_amount: "",
      saved_amount: "",
      target_date: "",
    },
  });

  useEffect(() => {
    if (goal) {
      reset({
        name: goal.name || "",
        target_amount: goal.target_amount || "",
        saved_amount: goal.saved_amount || "",
        target_date: goal.target_date || "",
      });
    } else {
      reset({
        name: "",
        target_amount: "",
        saved_amount: "",
        target_date: "",
      });
    }
  }, [goal, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSaving) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            {goal ? "Edit Goal" : "New Goal"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* GOAL NAME */}
          <div className="space-y-2">
            <Label htmlFor="goal-name">
              Goal Name
            </Label>

            <Input
              id="goal-name"
              placeholder="e.g. New Laptop"
              {...register("name", {
                required: true,
              })}
            />
          </div>

          {/* TARGET AMOUNT */}
          <div className="space-y-2">
            <Label htmlFor="target-amount">
              Target Amount
            </Label>

            <Input
              id="target-amount"
              type="number"
              min="0"
              placeholder="40000"
              {...register("target_amount", {
                required: true,
              })}
            />
          </div>

          {/* SAVED AMOUNT */}
          <div className="space-y-2">
            <Label htmlFor="saved-amount">
              Saved Amount
            </Label>

            <Input
              id="saved-amount"
              type="number"
              min="0"
              placeholder="10000"
              {...register("saved_amount")}
            />
          </div>

          {/* TARGET DATE */}
          <div className="space-y-2">
            <Label htmlFor="target-date">
              Target Date
            </Label>

            <Input
              id="target-date"
              type="date"
              {...register("target_date", {
                required: true,
              })}
            />
          </div>

          {/* BUTTONS */}
          <DialogFooter>

            <Button
              variant="outline"
              type="button"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : goal
                  ? "Update Goal"
                  : "Create Goal"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}