import GoalsActionsDropdownMenu from "./goals-actions-dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { useFormAction } from "@/modules/homepage/use-form-action";

type Props = {
  goal: Awaited<ReturnType<typeof useFormAction>>["buckets"][number];
};

export default function GoalCard({ goal }: Props) {
  const progressPercentage = Number(
    (
      (Number(goal.totalAmount) / Number(goal.goal?.targetAmount ?? 0)) *
      100
    ).toFixed(0),
  );

  return goal.goal ? (
    <Card className="relative flex flex-col justify-between">
      <GoalsActionsDropdownMenu bucketId={goal.goal.bucketId} />
      <CardHeader>
        <CardTitle className="uppercase">{goal.name}</CardTitle>
        <CardDescription className="whitespace-break-spaces">
          {goal.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="grid gap-y-1">
        <div className="flex items-center justify-between">
          <strong>{formatCurrency(goal.totalAmount)}</strong>
          <span className="text-sm text-muted-foreground">
            of {formatCurrency(goal.goal?.targetAmount ?? "0")}
          </span>
        </div>
        <Progress value={progressPercentage} />
        <small className="text-end text-sm text-muted-foreground">
          {progressPercentage}% of goal
        </small>
      </CardFooter>
    </Card>
  ) : null;
}
