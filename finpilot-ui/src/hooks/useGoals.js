import { useQuery } from "@tanstack/react-query";
import { getGoals } from "@/services/goalService";

export default function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  });
}