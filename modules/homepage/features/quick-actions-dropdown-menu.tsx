import PartialTransactionsDialog from "../components/partial-transactions-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SquareStack } from "lucide-react";
import { useState } from "react";

type Action = "partial-transactions";

export default function QuickActionsDropdownMenu() {
  const [dialogContent, setDialogContent] = useState<Action>(
    "partial-transactions",
  );

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Quick Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => setDialogContent("partial-transactions")}
            >
              <SquareStack />
              Partial Transactions
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        {dialogContent === "partial-transactions" ? (
          <PartialTransactionsDialog />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
