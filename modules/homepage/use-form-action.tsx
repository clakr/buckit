import { createBucket, fetchBucketsByUserId } from "@/database/actions/bucket";
import { createGoal } from "@/database/actions/goal";
import { createTransaction } from "@/database/actions/transaction";
import {
  createBucketGoalSchema,
  createBucketSchema,
  createPartialTransactionSchema,
  createTransactionSchema,
} from "@/database/schema";
import {
  createContext,
  PropsWithChildren,
  useActionState,
  useContext,
} from "react";
import { z } from "zod";

type FormActionArgs =
  | {
      intent: "create-bucket";
      data: z.infer<typeof createBucketSchema>;
    }
  | {
      intent: "create-goal";
      data: z.infer<typeof createBucketGoalSchema>;
    }
  | {
      intent: "create-transaction";
      data: z.infer<typeof createTransactionSchema>;
    }
  | {
      intent: "create-partial-transactions";
      data: z.infer<typeof createPartialTransactionSchema>;
    };

export const FormActionContext = createContext<
  | {
      buckets: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
      formAction: (args: FormActionArgs) => void;
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
    FormActionArgs
  >(async (initialState, { intent, data }) => {
    if (intent === "create-bucket") {
      const newBucket = await createBucket(data);
      return [...initialState, newBucket];
    } else if (intent === "create-goal") {
      const newBucket = await createBucket({
        name: data.name,
        totalAmount: data.totalAmount,
        description: data.description,
      });

      const newGoal = await createGoal({
        bucketId: newBucket.id,
        targetAmount: data.targetAmount,
      });

      return [...initialState, { ...newBucket, goal: newGoal }];
    } else if (intent === "create-transaction") {
      const { bucket, transaction } = await createTransaction(data);

      const bucketIndex = initialState.findIndex((b) => bucket.id === b.id);
      const bucketTransactions = initialState[bucketIndex].transactions;

      return initialState.with(bucketIndex, {
        ...bucket,
        transactions: [...bucketTransactions, transaction],
      });
    } else if (intent === "create-partial-transactions") {
      // @monitoring
      const createdTransactions = await Promise.all(
        data.transactions.map(
          async (transaction) => await createTransaction(transaction),
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
