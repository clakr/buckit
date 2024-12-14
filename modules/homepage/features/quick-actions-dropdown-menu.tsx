import PartialTransactionsDialog from "../components/partial-transactions-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchBucketsByUserId } from "@/database/actions/bucket";
import { SquareStack } from "lucide-react";
import { useState } from "react";

type Action = "partial-transactions";

type Props = {
  data: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
};

export default function QuickActionsDropdownMenu({ data }: Props) {
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
          <PartialTransactionsDialog data={data} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
