import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchBucketsByUserId } from "@/database/actions/bucket";
import { SelectTransaction } from "@/database/schema";
import { cn, currencyFormatter } from "@/lib/utils";
import { CircleEqualIcon, CircleMinusIcon, CirclePlusIcon } from "lucide-react";

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

type Props = { data: Awaited<ReturnType<typeof fetchBucketsByUserId>> };
export default function TransactionsTable({ data }: Props) {
  const transactions = data
    .flatMap((bucket) =>
      bucket.transactions.map((transaction) => ({
        ...transaction,
        bucket: { name: bucket.name },
      })),
    )
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
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
  );
}
