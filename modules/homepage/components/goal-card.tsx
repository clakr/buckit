import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import GoalsActionsDropdownMenu from "@/modules/homepage/components/goals-actions-dropdown-menu";
import { useFormAction } from "@/modules/homepage/use-form-action";

type Props = {
  bucket: Awaited<ReturnType<typeof useFormAction>>["buckets"][number];
};

export default function GoalCard({ bucket }: Props) {
  const progressPercentage = Number(
    (
      (Number(bucket.totalAmount) / Number(bucket.goal?.targetAmount ?? 0)) *
      100
    ).toFixed(0),
  );

  if (!bucket.goal) return null;

  return (
    <Card className="relative flex flex-col justify-between">
      <GoalsActionsDropdownMenu bucketId={bucket.id} goalId={bucket.goal.id} />
      <CardHeader>
        <CardTitle className="uppercase">{bucket.name}</CardTitle>
        <CardDescription className="whitespace-break-spaces">
          {bucket.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="grid gap-y-1">
        <div className="flex items-center justify-between">
          <strong>{formatCurrency(bucket.totalAmount)}</strong>
          <span className="text-sm text-muted-foreground">
            of {formatCurrency(bucket.goal.targetAmount ?? "0")}
          </span>
        </div>
        <Progress value={progressPercentage} />
        <small className="text-end text-sm text-muted-foreground">
          {progressPercentage}% of goal
        </small>
      </CardFooter>
    </Card>
  );
}
