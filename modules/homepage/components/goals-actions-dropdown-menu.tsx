import UpdateGoalDialog from "./update-goal-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateTransactionsDialog from "@/modules/homepage/components/create-transactions-dialog";
import { FileText, MoreVertical, Pencil } from "lucide-react";
import { useState } from "react";

type Props = {
  bucketId: number;
};

type Dialog = "create-transaction" | "update-goal";

export default function GoalsActionsDropdownMenu({ bucketId }: Props) {
  const [dialogContent, setDialogContent] =
    useState<Dialog>("create-transaction");

  function DialogState() {
    if (dialogContent === "create-transaction")
      return <CreateTransactionsDialog bucketId={bucketId} />;
    else if (dialogContent === "update-goal")
      return <UpdateGoalDialog bucketId={bucketId} />;
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger
            onClick={() => setDialogContent("create-transaction")}
            asChild
          >
            <DropdownMenuItem>
              <FileText />
              Create Transaction
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            onClick={() => setDialogContent("update-goal")}
            asChild
          >
            <DropdownMenuItem>
              <Pencil />
              Update Goal
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
