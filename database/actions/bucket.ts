"use server";

import { db } from "@/database";
import { bucket, InsertBucket, transaction } from "@/database/schema";
import { auth } from "@clerk/nextjs/server";

export async function fetchBucketsByUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("no userId");

  const buckets = await db.query.bucket.findMany({
    where: (bucket, { eq }) => eq(bucket.userId, userId),
    with: {
      transactions: true,
    },
  });

  return buckets;
}

export async function createBucket(bucketData: Omit<InsertBucket, "userId">) {
  const { userId } = await auth();
  if (!userId) throw new Error("no userId");

  const [newBucket] = await db
    .insert(bucket)
    .values({
      userId,
      name: bucketData.name,
      description: bucketData.description,
      totalAmount: bucketData.totalAmount,
    })
    .returning();

  const bucketTransactions = [];

  if (+bucketData.totalAmount !== 0) {
    const [newTransaction] = await db
      .insert(transaction)
      .values({
        bucketId: newBucket.id,
        description: "Initial Bucket Value",
        amount: bucketData.totalAmount,
        type: "default",
      })
      .returning();

    bucketTransactions.push(newTransaction);
  }

  return { ...newBucket, transactions: bucketTransactions };
}
