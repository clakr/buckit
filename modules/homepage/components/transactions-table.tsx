import { SelectTransaction } from "@/database/schema";
import { cn, currencyFormatter } from "@/lib/utils";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { CircleEqualIcon, CircleMinusIcon, CirclePlusIcon } from "lucide-react";


export default function TransactionsTable() {
  const { buckets } = useFormAction();

  const transactions = buckets
    .flatMap((bucket) =>
      bucket.transactions.map((transaction) => ({
        ...transaction,
        bucket: { name: bucket.name },
      })),
    )
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return (
    
  );
}
