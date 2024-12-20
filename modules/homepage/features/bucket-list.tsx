import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencyFormatter } from "@/lib/utils";
import CreateBucketDialog from "@/modules/homepage/components/create-bucket-dialog";
import CreateTransactionDialog from "@/modules/homepage/components/create-transaction-dialog";
import { useFormAction } from "@/modules/homepage/useFormAction";
import { EllipsisVertical, FilePlus } from "lucide-react";
import { useState } from "react";

type Dialog = "create-transaction";

export default function BucketList() {
  const { buckets } = useFormAction();

  const [dialogContent, setDialogContent] = useState<Dialog>();

  const sortedBuckets = buckets
    .filter((bucket) => !bucket.goal)
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {sortedBuckets.map((bucket) => (
        <Card
          key={bucket.id}
          className="relative flex flex-col justify-between"
        >
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="absolute right-4 top-4">
                <span className="sr-only">Open Bucket Dropdown Menu</span>
                <EllipsisVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => setDialogContent("create-transaction")}
                  >
                    <FilePlus />
                    Create Transaction
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              {dialogContent === "create-transaction" ? (
                <CreateTransactionDialog bucketId={bucket.id} />
              ) : null}
            </DialogContent>
          </Dialog>
          <CardHeader>
            <CardTitle className="uppercase">{bucket.name}</CardTitle>
            <CardDescription>{bucket.description}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-end font-bold">
            {currencyFormatter.format(+bucket.totalAmount)}
          </CardFooter>
        </Card>
      ))}
      <CreateBucketDialog />
    </div>
  );
}
