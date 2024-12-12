"use server";

import { db } from "@/database";
import { bucket, InsertTransaction, transaction } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

export async function createBucketTransaction(
  transactionData: InsertTransaction,
) {
  if (transactionData.type === "default")
    throw new Error("invalid transaction type");

  const [newTransaction] = await db
    .insert(transaction)
    .values(transactionData)
    .returning();

  if (transactionData.type === "inbound") {
    await db
      .update(bucket)
      .set({
        totalAmount: sql`${bucket.totalAmount} + ${transactionData.amount}`,
      })
      .where(eq(bucket.id, transactionData.bucketId));
  } else {
    await db
      .update(bucket)
      .set({
        totalAmount: sql`${bucket.totalAmount} - ${transactionData.amount}`,
      })
      .where(eq(bucket.id, transactionData.bucketId));
  }

  return newTransaction;
}

export async function createTransaction(transactionData: InsertTransaction) {
  if (transactionData.type === "default")
    throw new Error("invalid transaction type");

  const [newTransaction] = await db
    .insert(transaction)
    .values({
      bucketId: transactionData.bucketId,
      description: transactionData.description,
      amount: transactionData.amount,
      type: transactionData.type,
    })
    .returning();

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

  return { bucket: updatedBucket, transaction: newTransaction };
}
