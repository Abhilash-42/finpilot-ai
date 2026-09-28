import GoalCard from "./GoalCard";

export default function GoalList({
  goals,
  onEdit,
  onDelete,
}) {
  if (!goals.length) {
    return (
      <div className="bg-white rounded-xl shadow p-16 text-center">

        <h2 className="text-2xl font-semibold">
          No Goals Yet
        </h2>

        <p className="text-slate-500 mt-2">
          Start saving for your dreams 🚀
        </p>

      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

    </div>
  );
}