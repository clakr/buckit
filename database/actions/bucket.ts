"use server";

import { db } from "@/database";
import { bucket, InsertBucket, transaction } from "@/database/schema";
import { auth } from "@clerk/nextjs/server";

export async function fetchBucketsByUserId() {
  let userId;
  if (process.env.NODE_ENV === "development") {
    userId = process.env.USER_ID;
  } else {
    const currentAuth = await auth();
    userId = currentAuth.userId;
  }
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

export async function createBucket(bucketData: Omit<InsertBucket, "userId">) {
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
