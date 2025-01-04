import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createPartialTransactionSchema } from "@/database/schema";
import { cn, formatCurrency } from "@/lib/utils";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { Banknote, Percent, PlusCircle, Trash } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { z } from "zod";

type Form = {
  baseAmount: string;
  description: string;
  partials: Partial[];
};

type Partial = {
  bucketId: string;
  type: "flat" | "percentage";
  amount: string;
};

const DEFAULT_FORM_STATE: Form = {
  baseAmount: "",
  description: "",
  partials: [
    {
      bucketId: "",
      type: "flat",
      amount: "",
    },
  ],
};

// @todo: add visual indicators for partial errors
export default function CreatePartialTransactionsDialog() {
  const { buckets, formAction } = useFormAction();
  const [errors, setErrors] =
    useState<z.inferFlattenedErrors<typeof createPartialTransactionSchema>>();

  const [form, setForm] = useState(DEFAULT_FORM_STATE);

  const remainingBaseAmount = form.baseAmount
    ? parseFloat(form.baseAmount) -
      form.partials.reduce((accumulator, partial) => {
        const partialAmount = parseFloat(
          partial.amount !== "" ? partial.amount : "0",
        );

        if (partial.type === "flat") {
          return accumulator + partialAmount;
        }

        return (
          accumulator + (partialAmount / 100) * parseFloat(form.baseAmount)
        );
      }, 0)
    : 0;

  const bucketOptions = buckets.map((bucket) => ({
    id: bucket.id,
    name: bucket.name,
  }));

  function handleChange<T extends HTMLInputElement | HTMLTextAreaElement>(
    event: ChangeEvent<T>,
  ) {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  type HandlePartialChangeArgs = {
    index: number;
    key: keyof (typeof form)["partials"][number];
    value: string;
  };
  function handlePartialChange({ index, key, value }: HandlePartialChangeArgs) {
    const partial = form.partials[index];

    const partials = form.partials.with(index, {
      ...partial,
      [key]: value,
    });

    setForm((prevForm) => ({
      ...prevForm,
      partials,
    }));
  }

  function handleAddPartial() {
    setForm((prevForm) => ({
      ...prevForm,
      partials: [...prevForm.partials, DEFAULT_FORM_STATE.partials[0]],
    }));
  }

  function handleRemovePartial(index: number) {
    if (form.partials.length === 1) return;

    setForm((prevForm) => ({
      ...prevForm,
      partials: prevForm.partials.toSpliced(index, 1),
    }));
  }

  function PartialTypeIcon({ type }: { type: Partial["type"] }) {
    const Icon = type === "flat" ? Banknote : Percent;

    return <Icon className="absolute left-2 top-1/2 size-5 -translate-y-1/2" />;
  }

  function handleSubmit() {
    if (remainingBaseAmount <= 0) return;

    const { success, error, data } =
      createPartialTransactionSchema.safeParse(form);

    if (!success) {
      setErrors(error.flatten());
      return;
    }

    setErrors(undefined);

    formAction({
      intent: "create-partial-transactions",
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
          <DialogTitle>Create Partial Transactions</DialogTitle>
          <DialogDescription>
            Input details below to create partial transactions.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form
        id="createPartialTransactionsForm"
        className="grid gap-y-4"
        action={handleSubmit}
      >
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label
            htmlFor="baseAmount"
            className="group-has-[span]:text-destructive"
          >
            Base Amount
          </Label>
          {errors?.fieldErrors.baseAmount && (
            <span className="text-end text-sm font-medium text-destructive">
              {errors.fieldErrors.baseAmount}
            </span>
          )}
          <Input
            type="number"
            name="baseAmount"
            id="baseAmount"
            className="col-span-full group-has-[span]:border-destructive"
            value={form.baseAmount}
            onChange={handleChange}
          />
        </div>
        <div className="group grid grid-cols-2 gap-y-1.5">
          <Label
            htmlFor="description"
            className="group-has-[span]:text-destructive"
          >
            Description
          </Label>
          {errors?.fieldErrors.description && (
            <span className="text-end text-sm font-medium text-destructive">
              {errors.fieldErrors.description}
            </span>
          )}
          <Textarea
            name="description"
            id="descripion"
            className="col-span-full group-has-[span]:border-destructive"
            rows={5}
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="partials">Partials</Label>
            <small className="flex items-center gap-x-2 font-medium">
              Remaining:
              <strong
                className={cn(remainingBaseAmount < 0 && "text-destructive")}
              >
                {formatCurrency(remainingBaseAmount)}
              </strong>
            </small>
          </div>
          <section className="grid gap-y-4">
            {form.partials.map((partial, index) => (
              <article
                key={index}
                className="grid grid-cols-[repeat(3,minmax(0,1fr)),max-content] gap-2"
              >
                <Select
                  value={partial.bucketId}
                  onValueChange={(value) =>
                    handlePartialChange({ index, key: "bucketId", value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bucket" />
                  </SelectTrigger>
                  <SelectContent>
                    {bucketOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={partial.type}
                  onValueChange={(value) =>
                    handlePartialChange({ index, key: "type", value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
                <span className="relative [--icon-left:theme(spacing.2)] [--icon-size:theme(spacing.5)]">
                  <PartialTypeIcon type={partial.type} />
                  <Input
                    type="number"
                    name={`amount-${index}`}
                    id={`amount-${index}`}
                    placeholder="Amount"
                    value={partial.amount}
                    onChange={(event) =>
                      handlePartialChange({
                        index,
                        key: "amount",
                        value: event.target.value,
                      })
                    }
                    className="ps-[calc(var(--icon-left)+var(--icon-size)+var(--icon-left))]"
                  />
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemovePartial(index)}
                  disabled={form.partials.length === 1}
                >
                  <span className="sr-only">Remove Partial</span>
                  <Trash />
                </Button>
              </article>
            ))}
          </section>
          <Button
            type="button"
            variant="secondary"
            className="mt-3 justify-self-start"
            onClick={handleAddPartial}
          >
            <PlusCircle />
            Add Partial
          </Button>
        </div>
      </form>
      <DialogFooter>
        <Button
          type="submit"
          form="createPartialTransactionsForm"
          disabled={remainingBaseAmount <= 0}
        >
          Create
        </Button>
      </DialogFooter>
    </>
  );
}
