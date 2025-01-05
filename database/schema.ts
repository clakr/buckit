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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
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
  totalAmount: z.coerce
    .number()
    .max(999_999_999_999, "Total amount reached the maximum value")
    .transform((value) => value.toString()),
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

export const selectTransactionSchema = createSelectSchema(transaction);

export const createTransactionSchema = createInsertSchema(transaction, {
  bucketId: z.coerce.number().refine((value) => value !== 0, {
    message: "Bucket is required",
  }),
  amount: z.coerce
    .number()
    .gte(0.01, "Amount must be at least 0.01")
    .max(999_999_999_999, "Total amount reached the maximum value")
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

export const createPartialSchema = createTransactionSchema
  .pick({ bucketId: true })
  .extend({
    type: z.enum(["flat", "percentage"]),
    amount: z.string().nonempty("Amount is required"),
  })
  .refine(
    (data) => {
      const parsedAmount = parseFloat(data.amount);

      if (data.type === "flat") {
        return (
          !isNaN(parsedAmount) &&
          parsedAmount >= 0.01 &&
          parsedAmount <= 999_999_999_999
        );
      } else if (data.type === "percentage") {
        return !isNaN(parsedAmount) && parsedAmount >= 0 && parsedAmount <= 100;
      }

      return false;
    },
    (data) => ({
      message:
        data.type === "flat"
          ? "Flat amount must be between 0.01 and 999,999,999,999."
          : "Percentage amount must be between 0 and 100.",
      path: ["amount"],
    }),
  );

export const createPartialTransactionSchema = z
  .object({
    baseAmount: z.coerce
      .number()
      .gte(0.01, "Base amount must be at least 0.01")
      .max(999_999_999_999, "Base amount reached the maximum value"),
    description: z.string().nonempty("Description is required"),
    partials: z.array(createPartialSchema),
  })
  .transform((data) => {
    const transactions: z.arrayOutputType<typeof createTransactionSchema> =
      data.partials.map((partial) => ({
        bucketId: partial.bucketId,
        amount:
          partial.type === "flat"
            ? partial.amount
            : ((data.baseAmount * parseFloat(partial.amount)) / 100).toString(),
        description: data.description,
        type: "inbound",
      }));

    return { ...data, transactions };
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
  targetAmount: z.coerce
    .number()
    .max(999_999_999_999, "Target amount reached the maximum value")
    .transform((value) => value.toString()),
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
