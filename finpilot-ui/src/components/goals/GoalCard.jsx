import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2, Calendar } from "lucide-react";

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
}) {
  const progress =
    Number(goal.target_amount) === 0
      ? 0
      : (Number(goal.saved_amount) /
          Number(goal.target_amount)) *
        100;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">

        <div className="flex justify-between items-start">

          <div>
            <h3 className="text-xl font-semibold">
              {goal.name}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              ₹{Number(goal.saved_amount).toLocaleString()}
              {" / "}
              ₹{Number(goal.target_amount).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => onEdit(goal)}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={() => onDelete(goal)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-500"
            >
              <Trash2 size={18} />
            </button>

          </div>

        </div>

        <div className="mt-5">
          <Progress value={progress} />
        </div>

        <div className="flex justify-between mt-3">

          <span className="font-medium text-orange-500">
            {progress.toFixed(0)}%
          </span>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={15} />
            {goal.target_date}
          </div>

        </div>

      </CardContent>
    </Card>
  );
}