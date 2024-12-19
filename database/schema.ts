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

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

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

export type SelectBucket = typeof bucket.$inferSelect;
export type InsertBucket = typeof bucket.$inferInsert;

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

export type SelectGoal = typeof goal.$inferSelect;
export type InsertGoal = typeof goal.$inferInsert;

export const goalRelations = relations(goal, ({ one }) => ({
  bucket: one(bucket, {
    fields: [goal.bucketId],
    references: [bucket.id],
  }),
}));
