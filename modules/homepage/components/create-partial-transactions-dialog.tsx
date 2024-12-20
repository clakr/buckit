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
import { useFormAction } from "@/modules/homepage/use-form-action";
import { Banknote, Percent, PlusCircle, Trash } from "lucide-react";
import { ChangeEvent, useState } from "react";

type Form = {
  baseAmount: string;
  description: string;
  partials: Partial[];
};

type Partial = {
  bucketId: string;
  type: "flat" | "percentage";
  amount: string;
  description: string;
};

const DEFAULT_FORM_STATE: Form = {
  baseAmount: "",
  description: "",
  partials: [
    {
      bucketId: "",
      type: "flat",
      amount: "",
      description: "",
    },
  ],
};

export default function CreatePartialTransactionsDialog() {
  const { buckets } = useFormAction();

  const [form, setForm] = useState(DEFAULT_FORM_STATE);

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
      <form className="grid gap-y-4">
        <div className="grid gap-y-1.5">
          <Label htmlFor="baseAmount">Base Amount</Label>
          <Input
            type="number"
            name="baseAmount"
            id="baseAmount"
            value={form.baseAmount}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-y-1.5">
          <Label htmlFor="description">
            Description <small>(optional)</small>
          </Label>
          <Textarea
            name="description"
            id="descripion"
            rows={5}
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="partials">Partials</Label>
            <span className="text-sm font-medium">Remaining: $0.00</span>
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
                <Textarea
                  name={`description-${index}`}
                  id={`description-${index}`}
                  rows={3}
                  className="col-start-1 col-end-[-2]"
                  placeholder="Description"
                  value={partial.description}
                  onChange={(event) =>
                    handlePartialChange({
                      index,
                      key: "description",
                      value: event.target.value,
                    })
                  }
                />
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
        <Button>Create</Button>
      </DialogFooter>
    </>
  );
}
