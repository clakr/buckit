"use server";

import { db } from "@/database";
import {
  bucket,
  createTransactionSchema,
  transaction,
} from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export async function createTransaction(
  transactionData: z.infer<typeof createTransactionSchema>,
) {
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
    where: (goal, { eq, and }) =>
      and(
        eq(goal.bucketId, transactionData.bucketId),
        eq(goal.isDeleted, false),
      ),
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
