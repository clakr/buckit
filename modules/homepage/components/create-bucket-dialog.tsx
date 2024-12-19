import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

// @todo: create client-side validation
export default function CreateBucketDialog() {
  const { formAction } = useFormAction();

  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(formData: FormData) {
    setIsOpen(false);
    formAction(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="grid place-content-center rounded-xl border bg-card py-12 text-card-foreground shadow hover:bg-primary/5">
        <span className="sr-only">Open Create Bucket Dialog</span>
        <PlusIcon className="size-20" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bucket</DialogTitle>
          <DialogDescription>
            Input the bucket details below to create a bucket
          </DialogDescription>
        </DialogHeader>
        <form
          id="createBucketForm"
          className="grid gap-y-4"
          action={handleSubmit}
        >
          <input type="hidden" name="form" value="createBucketForm" />
          <div className="grid gap-y-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" name="name" id="name" />
          </div>
          <div className="grid gap-y-2">
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input
              type="number"
              name="totalAmount"
              id="totalAmount"
              step={0.01}
              defaultValue={0}
            />
          </div>
          <div className="grid gap-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea name="description" id="description" rows={5} />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="createBucketForm">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
