"use server";

import { db } from "@/database";
import { bucket, createBucketSchema, transaction } from "@/database/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export async function fetchBucketsByUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("no userId");

  const buckets = await db.query.bucket.findMany({
    where: (bucket, { eq }) => eq(bucket.userId, userId),
    with: {
      transactions: true,
      goal: true,
    },
  });

  return buckets;
}

export async function createBucket(
  bucketData: z.infer<typeof createBucketSchema>,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("no userId");

  const [insertedBucket] = await db
    .insert(bucket)
    .values({
      userId,
      name: bucketData.name,
      description: bucketData.description,
      totalAmount: bucketData.totalAmount,
    })
    .returning();

  const transactions = [];

  if (+bucketData.totalAmount !== 0) {
    const [insertedTransaction] = await db
      .insert(transaction)
      .values({
        bucketId: insertedBucket.id,
        description: "Initial Bucket Value",
        type: "default",
        amount: bucketData.totalAmount,
        runningBalance: bucketData.totalAmount,
      })
      .returning();

    transactions.push(insertedTransaction);
  }

  return {
    ...insertedBucket,
    transactions,
    goal: null,
  };
}
