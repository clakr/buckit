import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { InsertTransaction } from "@/database/schema";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { PlusCircle, Trash } from "lucide-react";
import { useState } from "react";

type Partial = {
  bucketId: string;
  type: "flat" | "percentage";
  value: string;
  description: string;
};
type Form = {
  baseAmount: string;
  partials: Partial[];
};

// @todo: create client-side validation
export default function PartialTransactionsDialog() {
  const { buckets, formAction } = useFormAction();
  const [form, setForm] = useState<Form>({
    baseAmount: "",
    partials: [
      {
        bucketId: "",
        type: "flat",
        value: "0",
        description: "",
      },
    ],
  });

  function handleSubmit() {
    const closeButtonElement = document.querySelector(
      "button[data-button=close]",
    ) as HTMLButtonElement;
    closeButtonElement.click();

    const transactions: Omit<InsertTransaction, "runningBalance">[] =
      form.partials.map((partial) => {
        return {
          bucketId: +partial.bucketId,
          description: partial.description,
          amount:
            partial.type === "flat"
              ? parseFloat(partial.value).toFixed(2)
              : ((+partial.value / 100) * +form.baseAmount).toFixed(2),
          type: "inbound",
        };
      });

    const formData = new FormData();
    formData.append("form", "partialTransactionsForm");
    formData.append("transactions", JSON.stringify(transactions));

    formAction(formData);
  }

  function handleChange({
    index,
    key,
    value,
  }: {
    index: number;
    key: keyof Partial;
    value: string;
  }) {
    const partial = form.partials.at(index);
    if (!partial) return;

    const formPartials = form.partials.with(index, {
      ...partial,
      [key]: value,
    });
    setForm({ ...form, partials: formPartials });
  }

  function handleAddPartial() {
    setForm({
      ...form,
      partials: [
        ...form.partials,
        {
          bucketId: "",
          type: "flat",
          value: "0",
          description: "",
        },
      ],
    });
  }

  function handleRemovePartial(index: number) {
    if (form.partials.length === 1) return;

    setForm({
      ...form,
      partials: form.partials.filter(
        (_, partialIndex) => index !== partialIndex,
      ),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Partial Transactions</DialogTitle>
        <DialogDescription>
          Input details to create new transaction/s for each respective buckets
        </DialogDescription>
      </DialogHeader>
      <form
        id="partialTransactionsForm"
        className="grid gap-y-4"
        action={handleSubmit}
      >
        <input type="hidden" name="form" value="partialTransactionsForm" />
        <div>
          <Label htmlFor="baseAmount">Base Amount</Label>
          <Input
            type="number"
            name="baseAmount"
            id="baseAmount"
            min={0}
            step={0.01}
            value={form.baseAmount}
            onChange={(event) =>
              setForm({ ...form, baseAmount: event.target.value })
            }
          />
        </div>
        <div className="grid gap-y-1.5">
          <Label>Partials</Label>
          <div className="grid gap-y-3">
            {form.partials.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[max(125px)_max(125px)_1fr_36px] gap-1.5"
              >
                <Select
                  onValueChange={(value) =>
                    handleChange({ index, key: "bucketId", value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bucket" />
                  </SelectTrigger>
                  <SelectContent>
                    {buckets.map((bucket) => (
                      <SelectItem key={bucket.id} value={bucket.id.toString()}>
                        {bucket.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) =>
                    handleChange({ index, key: "type", value })
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
                <Input
                  type="number"
                  name="value"
                  id="value"
                  min={0}
                  step={0.01}
                  value={form.partials[index].value}
                  onChange={(event) =>
                    handleChange({
                      index,
                      key: "value",
                      value: event.target.value,
                    })
                  }
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={form.partials.length === 1}
                  onClick={() => handleRemovePartial(index)}
                >
                  <div className="sr-only">Remove Partial</div>
                  <Trash />
                </Button>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={form.partials[index].description}
                  onChange={(event) =>
                    handleChange({
                      index,
                      key: "description",
                      value: event.target.value,
                    })
                  }
                  className="col-span-3"
                  rows={3}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-1.5 justify-self-start"
            onClick={handleAddPartial}
          >
            <PlusCircle />
            Add Partial
          </Button>
        </div>
      </form>
      <DialogFooter>
        <Button type="submit" form="partialTransactionsForm">
          Create
        </Button>
      </DialogFooter>
    </>
  );
}
