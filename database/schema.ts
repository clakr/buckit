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

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

// BUCKET

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
  totalAmount: (schema) =>
    schema
      .nonempty("Total amount is required")
      .max(999_999_999_999, "Total amount reached the maximum value"),
  description: (schema) =>
    schema.max(1000, "Description must be at most 1000 characters"),
}).partial({
  userId: true,
});

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

export type SelectTransaction = typeof transaction.$inferSelect;
export type InsertTransaction = typeof transaction.$inferInsert;

export const transactionRelations = relations(transaction, ({ one }) => ({
  bucket: one(bucket, {
    fields: [transaction.bucketId],
    references: [bucket.id],
  }),
}));

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
