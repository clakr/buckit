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
import { convertBucketToGoalSchema } from "@/database/schema";
import FieldErrors from "@/modules/homepage/components/field-errors";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { useState } from "react";
import { z } from "zod";

type Props = {
  bucketId: number;
};

export default function ConvertBucketToGoal({ bucketId }: Props) {
  const { formAction } = useFormAction();
  const [errors, setErrors] =
    useState<z.inferFlattenedErrors<typeof convertBucketToGoalSchema>>();

  function handleSubmit(formData: FormData) {
    const { success, error, data } = convertBucketToGoalSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      setErrors(error.flatten());
      return;
    }

    setErrors(undefined);

    formAction({
      intent: "convert-bucket-to-goal",
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
          <DialogTitle>Convert Bucket To Goal</DialogTitle>
          <DialogDescription>
            Input details below to convert this bucket to goal
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form id="createGoalForm" className="grid gap-y-4" action={handleSubmit}>
        <input type="hidden" name="bucketId" value={bucketId} />
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
          />
          <FieldErrors errors={errors?.fieldErrors.targetAmount} />
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
