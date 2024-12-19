import { TabsContent } from "@/components/ui/tabs";
import GoalCard from "@/modules/homepage/components/goal-card";
import { useFormAction } from "@/modules/homepage/useFormAction";

export default function GoalsTabContent() {
  const { buckets } = useFormAction();

  const goals = buckets
    .filter((bucket) => bucket.goal !== null)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <TabsContent value="goals">
      <section className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </section>
    </TabsContent>
  );
}
