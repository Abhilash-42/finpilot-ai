import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import GoalList from "@/components/goals/GoalList";
import GoalDialog from "@/components/goals/GoalDialog";

import useGoals from "@/hooks/useGoals";

import {
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/services/goalService";

export default function Goals() {
  const queryClient = useQueryClient();

  const {
    data: goals = [],
    isLoading,
    isError,
  } = useGoals();

  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // =========================================================
  // CREATE GOAL
  // =========================================================

  const createMutation = useMutation({
    mutationFn: createGoal,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });

      setOpen(false);
      setSelectedGoal(null);
    },

    onError: (error) => {
      console.error("Failed to create goal:", error);
    },
  });

  // =========================================================
  // UPDATE GOAL
  // =========================================================

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateGoal(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });

      setOpen(false);
      setSelectedGoal(null);
    },

    onError: (error) => {
      console.error("Failed to update goal:", error);
    },
  });

  // =========================================================
  // DELETE GOAL
  // =========================================================

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
    },

    onError: (error) => {
      console.error("Failed to delete goal:", error);
    },
  });

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Goals
          </h1>

          <p className="text-slate-500 mt-2">
            Loading your savings goals...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Goals
          </h1>

          <p className="text-red-500 mt-2">
            Failed to load goals.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // NEW GOAL
  // =========================================================

  const handleNewGoal = () => {
    setSelectedGoal(null);
    setOpen(true);
  };

  // =========================================================
  // EDIT GOAL
  // =========================================================

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setOpen(true);
  };

  // =========================================================
  // DELETE GOAL
  // =========================================================

  const handleDeleteGoal = (goal) => {
    if (!goal?.id) {
      console.error("Cannot delete goal: missing goal id");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${goal.name}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(goal.id);
  };

  // =========================================================
  // FORM SUBMIT
  // =========================================================

  const handleSubmit = (data) => {
    const formattedData = {
      name: data.name,
      target_amount: Number(data.target_amount),
      saved_amount: Number(data.saved_amount || 0),
      target_date: data.target_date,
    };

    console.log("Submitting goal:", formattedData);

    if (selectedGoal) {
      updateMutation.mutate({
        id: selectedGoal.id,
        data: formattedData,
      });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold">
            Goals
          </h1>

          <p className="text-slate-500 mt-2">
            Track your savings goals.
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={handleNewGoal}
          disabled={isSaving}
        >
          <Plus size={18} />
          New Goal
        </Button>

      </div>

      {/* GOAL LIST */}
      <GoalList
        goals={goals}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
      />

      {/* ADD / EDIT DIALOG */}
      <GoalDialog
        open={open}
        onOpenChange={setOpen}
        goal={selectedGoal}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />

    </div>
  );
}