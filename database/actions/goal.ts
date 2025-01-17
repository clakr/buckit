"use server";

import { db } from "@/database";
import {
  convertGoalToBucketSchema,
  createGoalSchema,
  goal,
  updateGoalSchema,
} from "@/database/schema";
import { eq } from "drizzle-orm";
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

export async function updateGoal(goalData: z.infer<typeof updateGoalSchema>) {
  const [updatedGoal] = await db
    .update(goal)
    .set({
      targetAmount: goalData.targetAmount,
    })
    .where(eq(goal.id, goalData.id))
    .returning();

  return updatedGoal;
}

export async function convertGoalToBucket(
  goalData: z.infer<typeof convertGoalToBucketSchema>,
) {
  const [updatedGoal] = await db
    .update(goal)
    .set({
      isDeleted: true,
    })
    .where(eq(goal.id, goalData.id))
    .returning();

  return updatedGoal;
}
