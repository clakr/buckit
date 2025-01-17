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
import { updateBucketGoalSchema } from "@/database/schema";
import FieldErrors from "@/modules/homepage/components/field-errors";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { useState } from "react";
import { z } from "zod";

type Props = {
  bucketId: number;
};

export default function UpdateGoalDialog({ bucketId }: Props) {
  const { buckets, formAction } = useFormAction();

  const goal = buckets.find((bucket) => bucketId === bucket.id);

  const [errors, setErrors] =
    useState<z.inferFlattenedErrors<typeof updateBucketGoalSchema>>();

  function handleSubmit(formData: FormData) {
    const { success, error, data } = updateBucketGoalSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      setErrors(error.flatten());
      return;
    }

    setErrors(undefined);

    formAction({
      intent: "update-goal",
      data,
    });

    const closeButtonElement = document.querySelector(
      "button[data-button=close]",
    ) as HTMLButtonElement;
    closeButtonElement.click();
  }

  if (!goal || !goal.goal) return null;

  return (
    <>
      <DialogHeader>
        <DialogHeader>
          <DialogTitle>Update Goal</DialogTitle>
          <DialogDescription>
            Input details below to edit this goal.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form id="updateGoalForm" className="grid gap-y-4" action={handleSubmit}>
        <input type="hidden" name="id" id="id" defaultValue={goal.goal.id} />
        <input
          type="hidden"
          name="bucketId"
          id="bucketId"
          defaultValue={goal.id}
        />
        <div className="group grid gap-y-1.5">
          <Label htmlFor="name" className="group-has-[ul]:text-destructive">
            Name
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            className="group-has-[ul]:border-destructive"
            defaultValue={goal.name}
          />
          <FieldErrors errors={errors?.fieldErrors.name} />
        </div>
        <div className="group grid gap-y-1.5">
          <Label
            htmlFor="totalAmount"
            className="group-has-[ul]:text-destructive"
          >
            Total Amount
          </Label>
          <Input
            type="number"
            name="totalAmount"
            id="totalAmount"
            className="group-has-[ul]:border-destructive"
            defaultValue={goal.totalAmount}
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
            defaultValue={goal.goal.targetAmount}
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
            defaultValue={goal.description ?? ""}
          />
          <FieldErrors errors={errors?.fieldErrors.description} />
        </div>
      </form>
      <DialogFooter>
        <Button type="submit" form="updateGoalForm">
          Update
        </Button>
      </DialogFooter>
    </>
  );
}
