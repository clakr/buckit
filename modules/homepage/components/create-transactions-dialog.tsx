import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export function CreateTransactionsDialog() {
  return (
    <>
      <DialogHeader>
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Input details below to create a new transaction.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form className="grid gap-y-4">
        <div className="grid gap-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" name="amount" id="amount" />
        </div>
        <div className="grid gap-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" id="description" rows={5}></Textarea>
        </div>
        <div className="grid gap-y-3">
          <Label htmlFor="type">Type</Label>
          <RadioGroup defaultValue="inbound" name="type">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inbound" id="inbound" />
              <Label htmlFor="inbound">Inbound</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outbound" id="outbound" />
              <Label htmlFor="outbound">Outbound</Label>
            </div>
          </RadioGroup>
        </div>
      </form>
      <DialogFooter>
        <Button>Create</Button>
      </DialogFooter>
    </>
  );
}
