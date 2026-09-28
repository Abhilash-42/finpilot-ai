import api from "./api";

export const getGoals = async () => {
  const { data } = await api.get("/goals");
  return data;
};

export const createGoal = async (goal) => {
  const { data } = await api.post("/goals", goal);
  return data;
};

export const updateGoal = async (id, goal) => {
  const { data } = await api.put(`/goals/${id}`, goal);
  return data;
};

export const deleteGoal = async (id) => {
  const { data } = await api.delete(`/goals/${id}`);
  return data;
};