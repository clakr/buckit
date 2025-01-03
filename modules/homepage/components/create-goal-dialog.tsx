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
import { Textarea } from "@/components/ui/textarea";
import { createBucketGoalSchema } from "@/database/schema";
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
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label htmlFor="name" className="group-has-[span]:text-destructive">
            Name
          </Label>
          {errors?.fieldErrors.name && (
            <span className="text-end text-sm font-medium text-destructive">
              {errors.fieldErrors.name}
            </span>
          )}
          <Input
            type="text"
            name="name"
            id="name"
            className="col-span-full group-has-[span]:border-destructive"
          />
        </div>
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label
            htmlFor="totalAmount"
            className="group-has-[span]:text-destructive"
          >
            Total Amount
          </Label>
          {errors?.fieldErrors.totalAmount && (
            <span className="text-end text-sm font-medium text-destructive">
              {errors.fieldErrors.totalAmount}
            </span>
          )}
          <Input
            type="number"
            name="totalAmount"
            id="totalAmount"
            className="col-span-full group-has-[span]:border-destructive"
          />
        </div>
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label
            htmlFor="targetAmount"
            className="group-has-[span]:text-destructive"
          >
            Target Amount
          </Label>
          {errors?.fieldErrors.targetAmount && (
            <span className="text-end text-sm font-medium text-destructive">
              {errors.fieldErrors.targetAmount}
            </span>
          )}
          <Input
            type="number"
            name="targetAmount"
            id="targetAmount"
            className="col-span-full group-has-[span]:border-destructive"
          />
        </div>
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label
            htmlFor="description"
            className="group-has-[span]:text-destructive"
          >
            Description <small>(optional)</small>
          </Label>
          {errors?.fieldErrors.description && (
            <span className="text-end text-sm font-medium text-destructive">
              {errors.fieldErrors.description}
            </span>
          )}
          <Textarea
            name="description"
            id="description"
            rows={5}
            className="col-span-full group-has-[span]:border-destructive"
          />
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
