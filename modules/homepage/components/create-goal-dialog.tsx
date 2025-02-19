import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBucketGoalSchema } from "@/database/schema";
import FieldErrors from "@/modules/homepage/components/field-errors";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { useState } from "react";
import { z } from "zod";

export default function CreateGoalDialog() {
  const { formAction } = useFormAction();
  const [errors, setErrors] =
    useState<z.inferFlattenedErrors<typeof createBucketGoalSchema>>();

  function handleSubmit(formData: FormData) {
    const { success, error, data } = createBucketGoalSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      setErrors(error.flatten());
      return;
    }

    setErrors(undefined);

    formAction({
      intent: "create-goal",
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
          <DialogTitle>Create Goal</DialogTitle>
          <DialogDescription>
            Input details below to create a new goal.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form id="createGoalForm" className="grid gap-y-4" action={handleSubmit}>
        <div className="group grid gap-y-1.5">
          <Label htmlFor="name" className="group-has-[ul]:text-destructive">
            Name
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            className="group-has-[ul]:border-destructive"
          />
          <FieldErrors errors={errors?.fieldErrors.name} />
        </div>
        <div className="group grid gap-y-1.5">
          <Label
            htmlFor="initialAmount"
            className="group-has-[ul]:text-destructive"
          >
            Initial Amount
          </Label>
          <Input
            type="number"
            name="totalAmount"
            id="initialAmount"
            className="group-has-[ul]:border-destructive"
            step="0.01"
          />
          <FieldErrors errors={errors?.fieldErrors.totalAmount} />
        </div>
        <div className="group grid gap-y-1.5">
          <Label
            htmlFor="targetAmount"
            className="group-has-[ul]:text-destructive"
          >
            Target Amount
          </Label>
          <Input
            type="number"
            name="targetAmount"
            id="targetAmount"
            className="group-has-[ul]:border-destructive"
            step="0.01"
          />
          <FieldErrors errors={errors?.fieldErrors.targetAmount} />
        </div>
        <div className="group grid gap-y-1.5">
          <Label
            htmlFor="description"
            className="group-has-[ul]:text-destructive"
          >
            Description <small>(optional)</small>
          </Label>
          <Textarea
            name="description"
            id="description"
            rows={5}
            className="group-has-[ul]:border-destructive"
          />
          <FieldErrors errors={errors?.fieldErrors.description} />
        </div>
      </form>
      <DialogFooter>
        <Button type="submit" form="createGoalForm">
          Create
        </Button>
      </DialogFooter>
    </>
  );
}
