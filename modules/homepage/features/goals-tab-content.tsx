import { TabsContent } from "@/components/ui/tabs";
import GoalCard from "@/modules/homepage/components/goal-card";
import RecentTransactionsTable from "@/modules/homepage/components/recent-transactions-table";
import { useFormAction } from "@/modules/homepage/use-form-action";

export default function GoalsTabContent() {
  const { buckets } = useFormAction();

  const goals = buckets
    .filter((bucket) => bucket.goal !== null)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <TabsContent value="goals" className="grid gap-y-8">
      <section className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </section>
      <section>
        <h2 className="font-medium">Recent Transactions</h2>
        <RecentTransactionsTable data={goals} />
      </section>
    </TabsContent>
  );
}
