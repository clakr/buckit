import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateBucketDialog from "@/modules/homepage/components/create-bucket-dialog";
import CreateGoalDialog from "@/modules/homepage/components/create-goal-dialog";
import CreatePartialTransactionsDialog from "@/modules/homepage/components/create-partial-transactions-dialog";
import { Coins, Goal, SquareStack } from "lucide-react";
import { useState } from "react";

type Dialog = "create-bucket" | "create-goal" | "create-partial-transactions";

export default function QuickActionsDropdownMenu() {
  const [dialogContent, setDialogContent] = useState<Dialog>("create-bucket");

  function DialogState() {
    if (dialogContent === "create-bucket") return <CreateBucketDialog />;
    else if (dialogContent === "create-goal") return <CreateGoalDialog />;
    else if (dialogContent === "create-partial-transactions")
      return <CreatePartialTransactionsDialog />;
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Quick Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger
            onClick={() => setDialogContent("create-bucket")}
            asChild
          >
            <DropdownMenuItem>
              <Coins />
              Create Bucket
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            onClick={() => setDialogContent("create-goal")}
            asChild
          >
            <DropdownMenuItem>
              <Goal />
              Create Goal
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            onClick={() => setDialogContent("create-partial-transactions")}
            asChild
          >
            <DropdownMenuItem>
              <SquareStack />
              Create Partial Transactions
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogState />
      </DialogContent>
    </Dialog>
  );
}
