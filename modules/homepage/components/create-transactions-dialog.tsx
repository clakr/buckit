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
import { createTransactionSchema } from "@/database/schema";
import FieldErrors from "@/modules/homepage/components/field-errors";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { useState } from "react";
import { z } from "zod";

type Props = {
  bucketId: number;
};

export default function CreateTransactionsDialog({ bucketId }: Props) {
  const { formAction } = useFormAction();
  const [errors, setErrors] =
    useState<z.inferFlattenedErrors<typeof createTransactionSchema>>();

  function handleSubmit(formData: FormData) {
    const { success, error, data } = createTransactionSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      setErrors(error.flatten());
      return;
    }

    setErrors(undefined);

    formAction({
      intent: "create-transaction",
      data,
    });

    const closeButtonElement = document.querySelector(
      "button[data-button=close]",
    ) as HTMLButtonElement;
    closeButtonElement.click();
  }

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
      <form
        id="createTransactionForm"
        className="grid gap-y-4"
        action={handleSubmit}
      >
        <input type="hidden" name="bucketId" value={bucketId} />
        <div className="group grid gap-y-1.5">
          <Label htmlFor="amount" className="group-has-[ul]:text-destructive">
            Amount
          </Label>
          <Input
            type="number"
            name="amount"
            id="amount"
            className="group-has-[ul]:border-destructive"
            step="0.01"
          />
          <FieldErrors errors={errors?.fieldErrors.amount} />
        </div>
        <div className="group grid gap-y-1.5">
          <Label
            htmlFor="description"
            className="group-has-[ul]:text-destructive"
          >
            Description
          </Label>
          <Textarea
            name="description"
            id="description"
            rows={5}
            className="group-has-[ul]:border-destructive"
          />
          <FieldErrors errors={errors?.fieldErrors.description} />
        </div>
        <div className="group grid gap-y-3">
          <Label htmlFor="type" className="group-has-[ul]:text-destructive">
            Type
          </Label>
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
          <FieldErrors errors={errors?.fieldErrors.type} />
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
