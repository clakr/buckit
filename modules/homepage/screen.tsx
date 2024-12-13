"use client";

import { FormActionProvider } from "./useFormAction";
import { createBucket, fetchBucketsByUserId } from "@/database/actions/bucket";
import { createTransaction } from "@/database/actions/transaction";
import { SelectTransaction } from "@/database/schema";
import TransactionsTable from "@/modules/homepage/components/transactions-table";
import BucketList from "@/modules/homepage/features/bucket-list";
import { useActionState } from "react";

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
      const { bucket, transaction } = await createTransaction({
        bucketId: parseInt(data.bucketId.toString() ?? "0"),
        description: data.description.toString() ?? "",
        type: data.type as SelectTransaction["type"],
        amount: data.amount.toString() ?? "",
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

  return (
    <FormActionProvider value={formAction}>
      <main className="mx-auto grid max-w-screen-xl gap-y-4 p-6">
        <section className="grid gap-y-2">
          <h1 className="font-bold">Buckets</h1>
          <BucketList data={buckets} />
        </section>
        <section className="grid gap-y-2">
          <h2 className="font-medium">Recent Transactions</h2>
          <TransactionsTable data={buckets} />
        </section>
      </main>
    </FormActionProvider>
  );
}
