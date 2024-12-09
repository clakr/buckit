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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/database";
import { SelectTransaction } from "@/database/schema";
import { cn, currencyFormatter } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import {
  CircleEqualIcon,
  CircleMinusIcon,
  CirclePlusIcon,
  PlusIcon,
} from "lucide-react";

async function fetchBuckets() {
  const { userId } = await auth();
  if (!userId) throw new Error("no userId");

  const buckets = await db.query.bucket.findMany({
    where: (buckets, { eq }) => eq(buckets.userId, userId),
    with: {
      transactions: true,
    },
  });

  const transactions = buckets.flatMap((bucket) =>
    bucket.transactions.map((transaction) => ({
      ...transaction,
      bucket: { name: bucket.name },
    })),
  );

  return { buckets, transactions };
}

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

export default async function Page() {
  const { buckets, transactions } = await fetchBuckets();

  return (
    <main className="mx-auto grid max-w-screen-xl gap-y-4 p-6">
      <section className="grid gap-y-2">
        <h1 className="font-bold">Buckets</h1>
        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {buckets.map((bucket) => (
            <Card key={bucket.id} className="flex flex-col justify-between">
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
              <form className="grid gap-y-4">
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
                <Button>Create</Button>
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
