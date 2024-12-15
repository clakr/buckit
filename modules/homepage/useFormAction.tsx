import { createBucket, fetchBucketsByUserId } from "@/database/actions/bucket";
import { createGoal } from "@/database/actions/goal";
import { createTransaction } from "@/database/actions/transaction";
import { SelectTransaction } from "@/database/schema";
import {
  createContext,
  PropsWithChildren,
  useActionState,
  useContext,
} from "react";

export const FormActionContext = createContext<
  | {
      buckets: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
      formAction: (payload: FormData) => void;
    }
  | undefined
>(undefined);

export function FormActionProvider({
  children,
  data,
}: PropsWithChildren<{
  data: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
}>) {
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
    } else if (data.form === "partialTransactionsForm") {
      const parsedTransactions = JSON.parse(
        data.transactions.toString(),
      ) as Array<{
        bucketId: number;
        description: string;
        amount: string;
        type: "inbound";
      }>;

      // @monitoring
      const createdTransactions = await Promise.all(
        parsedTransactions.map(
          async (transaction) => await createTransaction({ ...transaction }),
        ),
      );

      return createdTransactions.reduce((previous, { bucket, transaction }) => {
        const bucketIndex = initialState.findIndex((b) => bucket.id === b.id);
        const bucketTransactions = initialState[bucketIndex].transactions;

        return previous.with(bucketIndex, {
          ...bucket,
          transactions: [...bucketTransactions, transaction],
        });
      }, initialState);
    } else if (data.form === "createGoalForm") {
      const newBucket = await createBucket({
        name: data.name.toString() ?? "",
        description: data.description.toString() ?? "",
        totalAmount: data.initialAmount.toString() ?? "0",
      });

      const newGoal = await createGoal({
        bucketId: newBucket.id,
        targetAmount: data.targetAmount.toString() ?? "0",
      });

      return [...initialState, { ...newBucket, goal: newGoal }];
    }

    return initialState;
  }, data);

  return (
    <FormActionContext.Provider value={{ buckets, formAction }}>
      {children}
    </FormActionContext.Provider>
  );
}

export function useFormAction() {
  const context = useContext(FormActionContext);
  if (context === undefined)
    throw new Error("useFormAction must be used within a FormActionProvider");

  return context;
}
