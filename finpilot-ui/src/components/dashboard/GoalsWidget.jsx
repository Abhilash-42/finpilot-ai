import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useGoals from "@/hooks/useGoals";

export default function GoalsWidget() {
  const { data, isLoading, isError } = useGoals();

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-red-500">
            Failed to load goals.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Goals</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {data.map((goal) => {
          const progress =
            Number(goal.target_amount) === 0
              ? 0
              : (
                  (Number(goal.saved_amount) /
                    Number(goal.target_amount)) *
                  100
                );

          return (
            <div key={goal.id}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {goal.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    ₹{Number(goal.saved_amount).toLocaleString("en-IN")}
                    {" / "}
                    ₹{Number(goal.target_amount).toLocaleString("en-IN")}
                  </p>
                </div>

                <span className="font-bold text-orange-500">
                  {progress.toFixed(0)}%
                </span>
              </div>

              <Progress value={progress} />

              <p className="mt-2 text-xs text-slate-400">
                Target:{" "}
                {new Date(goal.target_date).toLocaleDateString("en-IN")}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}