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

export default function CreateGoalDialog() {
  return (
    <>
      <DialogHeader>
        <DialogHeader>
          <DialogTitle>Create Goal</DialogTitle>
          <DialogDescription>
            Input details below to create a new goal.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
      <form className="grid gap-y-4">
        <div className="grid gap-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input type="text" name="name" id="name" />
        </div>
        <div className="grid gap-y-1.5">
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input type="number" name="totalAmount" id="totalAmount" />
        </div>
        <div className="grid gap-y-1.5">
          <Label htmlFor="targetAmount">Target Amount</Label>
          <Input type="number" name="targetAmount" id="targetAmount" />
        </div>
        <div className="grid gap-y-1.5">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea name="description" id="description" rows={5}></Textarea>
        </div>
      </form>
      <DialogFooter>
        <Button>Create</Button>
      </DialogFooter>
    </>
  );
}
