"use server";

import { db } from "@/database";
import { createGoalSchema, goal } from "@/database/schema";
import { z } from "zod";

export async function createGoal(goalData: z.infer<typeof createGoalSchema>) {
  const [newGoal] = await db
    .insert(goal)
    .values({
      bucketId: goalData.bucketId,
      targetAmount: goalData.targetAmount,
    })
    .returning();

  return newGoal;
}
