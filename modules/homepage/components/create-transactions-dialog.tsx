import { useFormAction } from "../use-form-action";
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
import { useState } from "react";
import { z } from "zod";

type Props = {
  bucketId: z.infer<typeof createTransactionSchema>["bucketId"];
};

export function CreateTransactionsDialog({ bucketId }: Props) {
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
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          {errors?.fieldErrors.amount ? (
            <span className="text-end text-xs font-medium text-destructive">
              {errors.fieldErrors.amount}
            </span>
          ) : null}
          <Input
            type="number"
            name="amount"
            id="amount"
            className="col-span-full group-has-[span]:border-destructive"
          />
        </div>
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label htmlFor="description">Description</Label>
          {errors?.fieldErrors.description ? (
            <span className="text-end text-xs font-medium text-destructive">
              {errors.fieldErrors.description}
            </span>
          ) : null}
          <Textarea
            name="description"
            id="description"
            rows={5}
            className="col-span-full group-has-[span]:border-destructive"
          />
        </div>
        <div className="group grid grid-cols-2 gap-y-3">
          <Label htmlFor="type">Type</Label>
          {errors?.fieldErrors.type ? (
            <span className="text-end text-xs font-medium text-destructive">
              {errors.fieldErrors.type}
            </span>
          ) : null}
          <RadioGroup
            defaultValue="inbound"
            name="type"
            className="col-span-full"
          >
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
