import { useFormAction } from "../useFormAction";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

export default function BucketsTabContent() {
  const { buckets } = useFormAction();

  const sortedBuckets = buckets
    .filter((bucket) => !bucket.goal)
    .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <TabsContent value="buckets">
      <section className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {sortedBuckets.map((bucket) => (
          <Card key={bucket.id} className="flex flex-col justify-between">
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
    </TabsContent>
  );
}
