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
import { createBucketSchema } from "@/database/schema";
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
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label htmlFor="name" className="group-has-[span]:text-destructive">
            Name
          </Label>
          {errors?.fieldErrors.name ? (
            <span className="text-end text-xs font-medium text-destructive">
              {errors.fieldErrors.name}
            </span>
          ) : null}
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
          {errors?.fieldErrors.totalAmount ? (
            <span className="text-end text-xs font-medium text-destructive">
              {errors.fieldErrors.totalAmount}
            </span>
          ) : null}
          <Input
            type="text"
            name="totalAmount"
            id="totalAmount"
            className="col-span-full group-has-[span]:border-destructive"
          />
        </div>
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label
            htmlFor="description"
            className="group-has-[span]:text-destructive"
          >
            Description (optional)
          </Label>
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
      </form>
      <DialogFooter>
        <Button type="submit" form="createBucketForm">
          Create
        </Button>
      </DialogFooter>
    </>
  );
}
