import {
  createBucket,
  fetchBucketsByUserId,
  updateBucket,
} from "@/database/actions/bucket";
import { createGoal, updateGoal } from "@/database/actions/goal";
import { createTransaction } from "@/database/actions/transaction";
import {
  createBucketGoalSchema,
  createBucketSchema,
  createPartialTransactionSchema,
  createTransactionSchema,
  updateBucketGoalSchema,
  updateBucketSchema,
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
    }
  | {
      intent: "update-bucket";
      data: z.infer<typeof updateBucketSchema>;
    }
  | {
      intent: "update-goal";
      data: z.infer<typeof updateBucketGoalSchema>;
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
    ///////////////////
    // CREATE-BUCKET //
    ///////////////////
    if (intent === "create-bucket") {
      const newBucket = await createBucket(data);

      return [...initialState, newBucket];
    }

    /////////////////
    // CREATE-GOAL //
    /////////////////
    else if (intent === "create-goal") {
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
    }

    ////////////////////////
    // CREATE-TRANSACTION //
    ////////////////////////
    else if (intent === "create-transaction") {
      const { bucket: newBucket, transaction: newTransaction } =
        await createTransaction(data);

      const bucketIndex = initialState.findIndex((b) => newBucket.id === b.id);

      const transactions = [
        ...initialState[bucketIndex].transactions,
        newTransaction,
      ];

      return initialState.with(bucketIndex, {
        ...newBucket,
        transactions,
      });
    }

    /////////////////////////////////
    // CREATE-PARTIAL-TRANSACTIONS //
    /////////////////////////////////
    else if (intent === "create-partial-transactions") {
      // @monitoring
      const createdTransactions = await Promise.all(
        data.transactions.map(
          async (transaction) => await createTransaction(transaction),
        ),
      );

      return createdTransactions.reduce((previous, { bucket, transaction }) => {
        const bucketIndex = initialState.findIndex((b) => bucket.id === b.id);

        const transactions = [
          ...initialState[bucketIndex].transactions,
          transaction,
        ];

        return previous.with(bucketIndex, {
          ...bucket,
          transactions,
        });
      }, initialState);
    }

    ///////////////////
    // UPDATE-BUCKET //
    ///////////////////
    else if (intent === "update-bucket") {
      const updatedBucket = await updateBucket(data);

      const bucketIndex = initialState.findIndex(
        (b) => updatedBucket.id === b.id,
      );

      const transactions = initialState[bucketIndex].transactions;

      return initialState.with(bucketIndex, {
        ...updatedBucket,
        transactions,
        goal: null,
      });
    }

    /////////////////
    // UPDATE-GOAL //
    /////////////////
    else if (intent === "update-goal") {
      const updatedBucket = await updateBucket({
        id: data.bucketId,
        name: data.name,
        totalAmount: data.totalAmount,
        description: data.description,
      });

      const updatedGoal = await updateGoal({
        id: data.id,
        bucketId: data.bucketId,
        targetAmount: data.targetAmount,
      });

      const bucketIndex = initialState.findIndex(
        (b) => updatedBucket.id === b.id,
      );

      const transactions = initialState[bucketIndex].transactions;

      return initialState.with(bucketIndex, {
        ...updatedBucket,
        goal: updatedGoal,
        transactions,
      });
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
