import { pgTable, integer, text, numeric, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const type = pgEnum("type", ['default', 'inbound', 'outbound'])


export const transactions = pgTable("transactions", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "transactions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	bucketId: integer("bucket_id").notNull(),
	description: text().notNull(),
	amount: numeric({ precision: 12, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	type: varchar().notNull(),
});

export const buckets = pgTable("buckets", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "buckets_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: varchar("user_id", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	totalAmount: numeric("total_amount", { precision: 9, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});
