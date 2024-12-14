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
import { fetchBucketsByUserId } from "@/database/actions/bucket";
import { currencyFormatter } from "@/lib/utils";
import CreateBucketDialog from "@/modules/homepage/components/create-bucket-dialog";
import CreateTransactionDialog from "@/modules/homepage/components/create-transaction-dialog";
import { EllipsisVertical, FilePlus } from "lucide-react";
import { Fragment, useState } from "react";

type Dialog = "create-transaction" | "archive-bucket" | false;

type Props = {
  data: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
};

export default function BucketList({ data }: Props) {
  const [dialogContent, setDialogContent] = useState<Dialog>();

  const buckets = data.toSorted(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {buckets.map((bucket) => (
        <Fragment key={bucket.id}>
          <Card className="relative flex flex-col justify-between">
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
        </Fragment>
      ))}
      <CreateBucketDialog />
    </div>
  );
}
