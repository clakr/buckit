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
import { createBucketSchema } from "@/database/schema";
import { FieldErrors } from "@/modules/homepage/components/field-errors";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { useState } from "react";
import { z } from "zod";

export default function CreateBucketDialog() {
  const { formAction } = useFormAction();
  const [errors, setErrors] =
    useState<z.inferFlattenedErrors<typeof createBucketSchema>>();

  function handleSubmit(formData: FormData) {
    const { success, error, data } = createBucketSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      setErrors(error.flatten());
      return;
    }

    setErrors(undefined);

    formAction({
      intent: "create-bucket",
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
          <DialogTitle>Create Bucket</DialogTitle>
          <DialogDescription>
            Input details below to create a new bucket.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form
        id="createBucketForm"
        className="grid gap-y-4"
        action={handleSubmit}
      >
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
          />
          <FieldErrors errors={errors?.fieldErrors.description} />
        </div>
      </form>
      <DialogFooter>
        <Button type="submit" form="createBucketForm">
          Create
        </Button>
      </DialogFooter>
    </>
  );
}
