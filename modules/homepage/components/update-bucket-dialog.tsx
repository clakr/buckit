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
import { updateBucketSchema } from "@/database/schema";
import FieldErrors from "@/modules/homepage/components/field-errors";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { useState } from "react";
import { z } from "zod";

type Props = {
  bucketId: number;
};

export default function UpdateBucketDialog({ bucketId }: Props) {
  const { buckets, formAction } = useFormAction();

  const bucket = buckets.find((bucket) => bucketId === bucket.id);

  const [errors, setErrors] =
    useState<z.inferFlattenedErrors<typeof updateBucketSchema>>();

  function handleSubmit(formData: FormData) {
    const { success, error, data } = updateBucketSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      setErrors(error.flatten());
      return;
    }

    setErrors(undefined);

    formAction({
      intent: "update-bucket",
      data,
    });

    const closeButtonElement = document.querySelector(
      "button[data-button=close]",
    ) as HTMLButtonElement;
    closeButtonElement.click();
  }

  if (!bucket) return null;

  return (
    <>
      <DialogHeader>
        <DialogHeader>
          <DialogTitle>Edit Bucket</DialogTitle>
          <DialogDescription>
            Input details below to edit this bucket.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form
        id="updateBucketForm"
        className="grid gap-y-4"
        action={handleSubmit}
      >
        <input type="hidden" name="id" id="id" defaultValue={bucket.id} />
        <div className="group grid gap-y-1.5">
          <Label htmlFor="name" className="group-has-[ul]:text-destructive">
            Name
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            className="group-has-[ul]:border-destructive"
            defaultValue={bucket.name}
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
            type="text"
            name="totalAmount"
            id="totalAmount"
            className="group-has-[ul]:border-destructive"
            defaultValue={bucket.totalAmount}
          />
          <FieldErrors errors={errors?.fieldErrors.totalAmount} />
        </div>
        <div className="group grid gap-y-1.5">
          <Label
            htmlFor="description"
            className="group-has-[ul]:text-destructive"
          >
            Description (optional)
          </Label>
          <Textarea
            name="description"
            id="description"
            rows={5}
            className="group-has-[ul]:border-destructive"
            defaultValue={bucket.description ?? ""}
          />
          <FieldErrors errors={errors?.fieldErrors.description} />
        </div>
      </form>
      <DialogFooter>
        <Button type="submit" form="updateBucketForm">
          Update
        </Button>
      </DialogFooter>
    </>
  );
}
