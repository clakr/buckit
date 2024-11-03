import { db } from "~/server/database";

export default defineEventHandler(async (event) => {
  const buckets = await db.query.buckets.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
      userId: false,
    },
    where: (buckets, { eq }) => eq(buckets.userId, event.context.auth.userId),
    orderBy: (buckets, { desc }) => [desc(buckets.updatedAt)],
    with: {
      transactions: {
        columns: {
          bucketId: false,
          updatedAt: false,
        },
      },
    },
  });

  const transactions = buckets
    .flatMap((bucket) =>
      bucket.transactions.map((transaction) => ({
        ...transaction,
        bucket: { name: bucket.name },
      })),
    )
    .toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return { buckets, transactions };
});
