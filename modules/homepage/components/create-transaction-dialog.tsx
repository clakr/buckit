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
import { SelectBucket } from "@/database/schema";
import { useFormAction } from "@/modules/homepage/useFormAction";

type Props = {
  bucketId: SelectBucket["id"];
};

export default function CreateTransactionDialog({ bucketId }: Props) {
  const formAction = useFormAction();

  function handleSubmit(formData: FormData) {
    const closeButtonElement = document.querySelector(
      "button[data-button=close]",
    ) as HTMLButtonElement;
    closeButtonElement.click();

    formAction(formData);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Transaction</DialogTitle>
        <DialogDescription>
          Input the transaction details below to create a new transaction for
          this bucket
        </DialogDescription>
      </DialogHeader>
      <form
        id="createTransactionForm"
        className="grid gap-y-4"
        action={handleSubmit}
      >
        <input type="hidden" name="form" value="createTransactionForm" />
        <input type="hidden" name="bucketId" value={bucketId} />
        <div className="grid gap-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" id="description" rows={3} />
        </div>
        <div className="grid gap-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" name="amount" id="amount" step={0.01} min={1} />
        </div>
        <div className="grid gap-y-2">
          <Label>Type</Label>
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
        <Button type="submit" form="createTransactionForm">
          Create
        </Button>
      </DialogFooter>
    </>
  );
}
