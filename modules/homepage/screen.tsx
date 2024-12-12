"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createBucket, fetchBucketsByUserId } from "@/database/actions/bucket";
import { createTransaction } from "@/database/actions/transaction";
import { SelectTransaction } from "@/database/schema";
import { cn, currencyFormatter } from "@/lib/utils";
import {
  CircleEqualIcon,
  CircleMinusIcon,
  CirclePlusIcon,
  EllipsisVertical,
  FilePlus,
  PlusIcon,
} from "lucide-react";
import { useActionState } from "react";

function getTransactionTypeIcon(type: SelectTransaction["type"]) {
  switch (type) {
    case "inbound":
      return <CirclePlusIcon />;

    case "outbound":
      return <CircleMinusIcon />;

    default:
      return <CircleEqualIcon />;
  }
}

function getTransactionTypeColor(type: SelectTransaction["type"]) {
  switch (type) {
    case "inbound":
      return "[--text-color:theme(colors.green.600)]";

    case "outbound":
      return "[--text-color:theme(colors.red.600)]";

    default:
      return "[--text-color:theme(colors.neutral.600)]";
  }
}

export default function Screen({
  data,
}: {
  data: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
}) {
  const [buckets, formAction] = useActionState<
    ReturnType<typeof fetchBucketsByUserId>,
    FormData
  >(async (initialState, formData) => {
    const data = Object.fromEntries(formData);

    if (data.form === "createBucketForm") {
      const newBucket = await createBucket({
        name: data.name.toString() ?? "",
        description: data.description.toString() ?? "",
        totalAmount: data.totalAmount.toString() ?? "0",
      });

      return [...initialState, newBucket];
    } else if (data.form === "createTransactionForm") {
      // const newTransaction  = await createTransaction()
      const { bucket, transaction } = await createTransaction({
        bucketId: parseInt(data.bucketId.toString() ?? "0"),
        description: data.description.toString() ?? "",
        amount: data.amount.toString() ?? "",
        type: data.type as SelectTransaction["type"],
      });

      const bucketIndex = initialState.findIndex((b) => bucket.id === b.id);
      const bucketTransactions = initialState[bucketIndex].transactions;

      return initialState.with(bucketIndex, {
        ...bucket,
        transactions: [...bucketTransactions, transaction],
      });
    }

    return initialState;
  }, data);

  // GET BUCKETS' TRANSACTIONS
  const transactions = buckets
    .flatMap((bucket) =>
      bucket.transactions.map((transaction) => ({
        ...transaction,
        bucket: { name: bucket.name },
      })),
    )
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const sortedBuckets = buckets.toSorted(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );

  return (
    <main className="mx-auto grid max-w-screen-xl gap-y-4 p-6">
      <section className="grid gap-y-2">
        <h1 className="font-bold">Buckets</h1>
        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {sortedBuckets.map((bucket) => (
            <Card
              key={bucket.id}
              className="relative flex flex-col justify-between"
            >
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger className="absolute right-2 top-2 after:absolute after:left-1/2 after:top-1/2 after:size-12 after:-translate-x-1/2 after:-translate-y-1/2">
                    <span className="sr-only">Open Bucket Dropdown Menu</span>
                    <EllipsisVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DialogTrigger asChild>
                      <DropdownMenuItem>
                        <FilePlus />
                        Create Transaction
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Transaction</DialogTitle>
                    <DialogDescription>
                      Input the transaction details below to create a new
                      transaction for this bucket
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    id="createTransactionForm"
                    className="grid gap-y-4"
                    action={formAction}
                  >
                    <input
                      type="hidden"
                      name="form"
                      value="createTransactionForm"
                    />
                    <input type="hidden" name="bucketId" value={bucket.id} />
                    <div className="grid gap-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea name="description" id="description" rows={3} />
                    </div>
                    <div className="grid gap-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        type="number"
                        name="amount"
                        id="amount"
                        step={0.01}
                      />
                    </div>
                    <div className="grid gap-y-2">
                      <Label>Type</Label>
                      <RadioGroup defaultValue="inbound" name="type">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="inbound" id="inbound" />
                          <Label htmlFor="inbound">Inbound</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="outbound" id="outbound" />
                          <Label htmlFor="outbound">Outbound</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button type="submit" form="createTransactionForm">
                      Create
                    </Button>
                  </DialogFooter>
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
          <Dialog>
            <DialogTrigger className="grid place-content-center rounded-xl border bg-card text-card-foreground shadow">
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
                action={formAction}
              >
                <input type="hidden" name="form" value="createBucketForm" />
                <div className="grid gap-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" name="name" id="name" />
                </div>
                <div className="grid gap-y-2">
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input type="number" name="totalAmount" id="totalAmount" />
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
        </div>
      </section>
      <section className="grid gap-y-2">
        <h2 className="font-medium">Recent Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bucket</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className={cn(
                  getTransactionTypeColor(transaction.type),
                  "*:whitespace-nowrap",
                )}
              >
                <TableCell className="text-[color:var(--text-color)] [&>svg]:size-5">
                  {getTransactionTypeIcon(transaction.type)}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="font-medium text-[color:var(--text-color)]">
                  {currencyFormatter.format(+transaction.amount)}
                </TableCell>
                <TableCell className="font-bold">
                  {transaction.bucket.name}
                </TableCell>
                <TableCell>{transaction.createdAt.toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
