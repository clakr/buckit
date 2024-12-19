import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Coins, Goal, SquareStack } from "lucide-react";

export default function ActionsDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Quick Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Coins />
          Create Bucket
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Goal />
          Create Goal
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SquareStack />
          Create Partial Transactions
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
