import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

////////////
// BUCKET //
////////////

export const bucket = pgTable("buckets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  name: varchar().notNull(),
  description: text(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  ...timestamps,
});

export const bucketRelations = relations(bucket, ({ one, many }) => ({
  transactions: many(transaction),
  goal: one(goal),
}));

export const createBucketSchema = createInsertSchema(bucket, {
  name: (schema) =>
    schema
      .nonempty("Name is required")
      .max(255, "Name must be at most 255 characters"),
  // @todo: coerce `totalAmount` to number
  totalAmount: (schema) =>
    schema
      .nonempty("Total amount is required")
      .max(999_999_999_999, "Total amount reached the maximum value"),
  description: (schema) =>
    schema.max(1000, "Description must be at most 1000 characters"),
}).partial({
  userId: true,
});

/////////////////
// TRANSACTION //
/////////////////

export const transactionEnum = pgEnum("type", [
  "default",
  "inbound",
  "outbound",
]);

export const transaction = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bucketId: integer("bucket_id")
    .references(() => bucket.id)
    .notNull(),
  description: text().notNull(),
  type: transactionEnum().notNull(),
  amount: decimal({ precision: 12, scale: 2 }).notNull(),
  runningBalance: decimal("running_balance", {
    precision: 12,
    scale: 2,
  }).notNull(),
  ...timestamps,
});

export const transactionRelations = relations(transaction, ({ one }) => ({
  bucket: one(bucket, {
    fields: [transaction.bucketId],
    references: [bucket.id],
  }),
}));

export const createTransactionSchema = createInsertSchema(transaction, {
  bucketId: z.coerce.number(),
  amount: z.coerce
    .number()
    .gte(1, "Amount must be at least 1")
    .transform((value) => value.toString()),
  description: (schema) =>
    schema
      .nonempty("Description is required")
      .max(1000, "Description must be at most 1000 characters"),
  type: (schema) =>
    schema.exclude(["default"], {
      message: "Type must be either Inbound or Outbound",
    }),
}).partial({
  runningBalance: true,
});

//////////
// GOAL //
//////////

export const goal = pgTable("goals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bucketId: integer("bucket_id")
    .references(() => bucket.id)
    .notNull(),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }).notNull(),
});

export const goalRelations = relations(goal, ({ one }) => ({
  bucket: one(bucket, {
    fields: [goal.bucketId],
    references: [bucket.id],
  }),
}));

export const createGoalSchema = createInsertSchema(goal, {
  // @todo: coerce `targetAmount` to number
  targetAmount: (schema) =>
    schema
      .nonempty("Target amount is required")
      .max(999_999_999_999, "Target amount reached the maximum value"),
});

export const createBucketGoalSchema = createBucketSchema
  .merge(createGoalSchema)
  .partial({
    bucketId: true,
  })
  .refine(
    (data) => {
      if (data.totalAmount !== null && data.targetAmount !== null) {
        return data.targetAmount > data.totalAmount;
      }

      return true;
    },
    {
      message: "Target amount must be greater than the total amount",
      path: ["targetAmount"],
    },
  );
