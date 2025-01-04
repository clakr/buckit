import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createTransactionSchema } from "@/database/schema";
import { CreateTransactionsDialog } from "@/modules/homepage/components/create-transactions-dialog";
import { FileText, MoreVertical } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

type Props = {
  bucketId: z.infer<typeof createTransactionSchema>["bucketId"];
};

type Dialog = "create-transaction";

export default function GoalsActionsDropdownMenu({ bucketId }: Props) {
  const [dialogContent, setDialogContent] =
    useState<Dialog>("create-transaction");

  function DialogState() {
    if (dialogContent === "create-transaction")
      return <CreateTransactionsDialog bucketId={bucketId} />;
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
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogState />
      </DialogContent>
    </Dialog>
  );
}
