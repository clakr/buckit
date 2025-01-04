import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchBucketsByUserId } from "@/database/actions/bucket";
import { selectTransactionSchema } from "@/database/schema";
import { cn, formatCurrency } from "@/lib/utils";
import { CircleEqualIcon, CircleMinusIcon, CirclePlusIcon } from "lucide-react";
import { z } from "zod";

type Props = {
  data: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
};

function getTransactionTypeIcon(
  type: z.infer<typeof selectTransactionSchema>["type"],
) {
  switch (type) {
    case "inbound":
      return <CirclePlusIcon />;

    case "outbound":
      return <CircleMinusIcon />;

    default:
      return <CircleEqualIcon />;
  }
}

function getTransactionTypeColor(
  type: z.infer<typeof selectTransactionSchema>["type"],
) {
  switch (type) {
    case "inbound":
      return "[--text-color:theme(colors.green.600)]";

    case "outbound":
      return "[--text-color:theme(colors.red.600)]";

    default:
      return "[--text-color:theme(colors.neutral.600)]";
  }
}

export default function RecentTransactionsTable({ data }: Props) {
  const transactions = data
    .flatMap((bucket) =>
      bucket.transactions.map((transaction) => ({
        ...transaction,
        bucket: { name: bucket.name },
      })),
    )
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Balance</TableHead>
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
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(transaction.runningBalance)}
            </TableCell>
            <TableCell className="font-bold">
              {transaction.bucket.name}
            </TableCell>
            <TableCell>{transaction.createdAt.toDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
