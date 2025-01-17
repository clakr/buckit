import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { convertGoalToBucketSchema } from "@/database/schema";
import FieldErrors from "@/modules/homepage/components/field-errors";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { useState } from "react";
import { z } from "zod";

type Props = {
  goalId: number;
};

export default function ConvertGoalToBucketDialog({ goalId }: Props) {
  const { formAction } = useFormAction();
  const [errors, setErrors] =
    useState<z.inferFlattenedErrors<typeof convertGoalToBucketSchema>>();

  function handleSubmit(formData: FormData) {
    const { success, error, data } = convertGoalToBucketSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      setErrors(error.flatten());
      return;
    }

    setErrors(undefined);

    formAction({
      intent: "convert-goal-to-bucket",
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
          <DialogTitle>Convert Goal to Bucket</DialogTitle>
          <DialogDescription>
            Are you sure you want to convert this goal to a bucket? This is
            irreversible.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form id="convertGoalToBucket" action={handleSubmit}>
        <input type="hidden" name="id" value={goalId} />
        <FieldErrors errors={errors?.fieldErrors.id} />
      </form>
      <DialogFooter>
        <Button type="submit" form="convertGoalToBucket">
          Convert
        </Button>
      </DialogFooter>
    </>
  );
}
