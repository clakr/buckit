"use server";

import { db } from "@/database";
import { bucket, InsertTransaction, transaction } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

export async function createTransaction(
  transactionData: Omit<InsertTransaction, "runningBalance">,
) {
  if (transactionData.type === "default")
    throw new Error("invalid transaction type");

  const [updatedBucket] = await db
    .update(bucket)
    .set({
      totalAmount:
        transactionData.type === "inbound"
          ? sql`${bucket.totalAmount} + ${transactionData.amount}`
          : sql`${bucket.totalAmount} - ${transactionData.amount}`,
    })
    .where(eq(bucket.id, transactionData.bucketId))
    .returning();

  const goal = await db.query.goal.findFirst({
    where: (goal, { eq }) => eq(goal.bucketId, transactionData.bucketId),
  });

  const [insertedTransaction] = await db
    .insert(transaction)
    .values({
      bucketId: transactionData.bucketId,
      description: transactionData.description,
      amount: transactionData.amount,
      type: transactionData.type,
      runningBalance: updatedBucket.totalAmount,
    })
    .returning();

  return {
    bucket: {
      ...updatedBucket,
      goal: goal ?? null,
    },
    transaction: insertedTransaction,
  };
}
