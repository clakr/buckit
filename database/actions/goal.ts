"use server";

import { db } from "@/database";
import { goal, InsertGoal } from "@/database/schema";

export async function createGoal(goalData: InsertGoal) {
  const [newGoal] = await db
    .insert(goal)
    .values({
      bucketId: goalData.bucketId,
      targetAmount: goalData.targetAmount,
    })
    .returning();

  return newGoal;
}
