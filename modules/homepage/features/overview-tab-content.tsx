import { useFormAction } from "../useFormAction";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { currencyFormatter } from "@/lib/utils";
import { Coins, Goal, PiggyBank } from "lucide-react";

export default function OverviewTabContent() {
  const { buckets } = useFormAction();

  const totalAccumulated = buckets.reduce(
    (previous, current) => previous + parseFloat(current.totalAmount),
    0,
  );

  const totalBucketsAmount = buckets
    .filter((bucket) => !bucket.goal)
    .reduce(
      (previous, current) => previous + parseFloat(current.totalAmount),
      0,
    );

  const totalGoalsAmount = buckets
    .filter((bucket) => bucket.goal)
    .reduce(
      (previous, current) => previous + parseFloat(current.totalAmount),
      0,
    );

  return (
    <TabsContent value="overview">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="flex flex-col justify-between md:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="uppercase">Total Accumulated</CardTitle>
            <PiggyBank className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardFooter className="font-bold">
            {currencyFormatter.format(totalAccumulated)}
          </CardFooter>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="uppercase">Total Buckets Amount</CardTitle>
            <Coins className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardFooter className="font-bold">
            {currencyFormatter.format(totalBucketsAmount)}
          </CardFooter>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="uppercase">Total Goals Amount</CardTitle>
            <Goal className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardFooter className="font-bold">
            {currencyFormatter.format(totalGoalsAmount)}
          </CardFooter>
        </Card>
      </section>
    </TabsContent>
  );
}
