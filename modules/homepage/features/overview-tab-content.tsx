import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useFormAction } from "@/modules/homepage/use-form-action";
import { Coins, Goal, PiggyBank } from "lucide-react";

export default function OverviewTabContent() {
  const { buckets } = useFormAction();

  const totalAccumulated = buckets.reduce((accumulator, bucket) => {
    const totalAmount = parseFloat(bucket.totalAmount);
    if (totalAmount < 0) return accumulator;

    return accumulator + totalAmount;
  }, 0);

  const totalBucketsAmount = buckets.reduce((accumulator, bucket) => {
    if (bucket.goal) return accumulator;

    const totalAmount = parseFloat(bucket.totalAmount);
    if (totalAmount < 0) return accumulator;

    return accumulator + totalAmount;
  }, 0);

  const totalGoalsAmount = buckets.reduce((accumulator, bucket) => {
    if (!bucket.goal) return accumulator;

    const totalAmount = parseFloat(bucket.totalAmount);
    if (totalAmount < 0) return accumulator;

    return accumulator + totalAmount;
  }, 0);

  return (
    <TabsContent value="overview">
      <section className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="flex flex-col justify-between md:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="uppercase">Total Accumulated</CardTitle>
            <PiggyBank className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardFooter className="font-bold">
            {formatCurrency(totalAccumulated)}
          </CardFooter>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="uppercase">Total Buckets Amount</CardTitle>
            <Coins className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardFooter className="font-bold">
            {formatCurrency(totalBucketsAmount)}
          </CardFooter>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="uppercase">Total Goals Amount</CardTitle>
            <Goal className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardFooter className="font-bold">
            {formatCurrency(totalGoalsAmount)}
          </CardFooter>
        </Card>
      </section>
    </TabsContent>
  );
}
