import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import BucketsActionsDropdownMenu from "@/modules/homepage/components/buckets-actions-dropdown-menu";
import RecentTransactionsTable from "@/modules/homepage/components/recent-transactions-table";
import { useFormAction } from "@/modules/homepage/use-form-action";

export default function BucketsTabContent() {
  const { buckets } = useFormAction();

  const sortedBuckets = buckets
    .filter((bucket) => !bucket.goal)
    .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <TabsContent value="buckets" className="grid gap-y-8">
      <section className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {sortedBuckets.map((bucket) => (
          <Card
            key={bucket.id}
            className="relative flex flex-col justify-between"
          >
            <BucketsActionsDropdownMenu bucketId={bucket.id} />
            <CardHeader>
              <CardTitle className="uppercase">{bucket.name}</CardTitle>
              <CardDescription>{bucket.description}</CardDescription>
            </CardHeader>
            <CardFooter className="justify-end font-bold">
              {formatCurrency(bucket.totalAmount)}
            </CardFooter>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="font-medium">Recent Transactions</h2>
        <RecentTransactionsTable data={sortedBuckets} />
      </section>
    </TabsContent>
  );
}
