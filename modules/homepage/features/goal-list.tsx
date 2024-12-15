import CreateTransactionDialog from "../components/create-transaction-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { currencyFormatter } from "@/lib/utils";
import CreateGoalDialog from "@/modules/homepage/components/create-goal-dialog";
import { useFormAction } from "@/modules/homepage/useFormAction";
import { EllipsisVertical, FilePlus } from "lucide-react";
import { useState } from "react";

type Dialog = "create-transaction";

export default function GoalList() {
  const { buckets } = useFormAction();

  const [dialogContent, setDialogContent] = useState<Dialog>();

  const goals = buckets
    .filter((bucket) => bucket.goal)
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  function getTotalAmountAndTargetAmountPercentage({
    totalAmount,
    targetAmount,
  }: {
    totalAmount: string;
    targetAmount: string;
  }) {
    return ((+totalAmount / +targetAmount) * 100).toFixed(0);
  }

  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {goals.map((bucket) => (
        <Card
          key={bucket.id}
          className="relative flex flex-col justify-between"
        >
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="absolute right-4 top-4">
                <span className="sr-only">Open Bucket Dropdown Menu</span>
                <EllipsisVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => setDialogContent("create-transaction")}
                  >
                    <FilePlus />
                    Create Transaction
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              {dialogContent === "create-transaction" ? (
                <CreateTransactionDialog bucketId={bucket.id} />
              ) : null}
            </DialogContent>
          </Dialog>

          <CardHeader>
            <CardTitle className="uppercase">{bucket.name}</CardTitle>
            <CardDescription>{bucket.description}</CardDescription>
          </CardHeader>

          {bucket.goal ? (
            <CardFooter className="grid gap-y-1">
              <div className="flex items-center justify-between">
                <strong>{currencyFormatter.format(+bucket.totalAmount)}</strong>
                <span className="text-sm text-muted-foreground">
                  of {currencyFormatter.format(+bucket.goal.targetAmount)}
                </span>
              </div>
              <Progress
                value={
                  +getTotalAmountAndTargetAmountPercentage({
                    totalAmount: bucket.totalAmount,
                    targetAmount: bucket.goal.targetAmount,
                  })
                }
              />
              <small className="justify-self-end text-xs text-muted-foreground">
                {getTotalAmountAndTargetAmountPercentage({
                  totalAmount: bucket.totalAmount,
                  targetAmount: bucket.goal.targetAmount,
                })}
                % of goal
              </small>
            </CardFooter>
          ) : null}
        </Card>
      ))}
      <CreateGoalDialog />
    </div>
  );
}
