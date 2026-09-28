import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/services/goalService";

export default function useGoalMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["goals"],
    });

  const createMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, goal }) => updateGoal(id, goal),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}