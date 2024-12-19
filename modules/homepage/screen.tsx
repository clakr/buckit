"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchBucketsByUserId } from "@/database/actions/bucket";
import TransactionsTable from "@/modules/homepage/components/transactions-table";
import BucketsTabContent from "@/modules/homepage/features/buckets-tab-content";
import GoalsTabContent from "@/modules/homepage/features/goals-tab-content";
import OverviewTabContent from "@/modules/homepage/features/overview-tab-content";
import QuickActionsDropdownMenu from "@/modules/homepage/features/quick-actions-dropdown-menu";
import { FormActionProvider } from "@/modules/homepage/use-form-action";

// @todo: separate buckets, goals and transactions
export default function Screen({
  data,
}: {
  data: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
}) {
  return (
    <FormActionProvider data={data}>
      <main className="mx-auto grid max-w-screen-xl gap-y-2 p-6">
        <h1 className="font-bold">Dashboard</h1>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="buckets">Buckets</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          <OverviewTabContent />
          <BucketsTabContent />
          <GoalsTabContent />
        </Tabs>
      </main>
      {/* <main className="mx-auto grid max-w-screen-xl gap-y-4 p-6">
        <section className="grid gap-y-2">
          <div className="flex items-center justify-between">
            <h1 className="font-bold">Buckets</h1>
            <QuickActionsDropdownMenu />
          </div>
          <BucketList />
        </section>
        <section className="grid gap-y-2">
          <h2 className="font-medium">Goals</h2>
          <GoalList />
        </section>
        <section className="grid gap-y-2">
          <h2 className="font-medium">Recent Transactions</h2>
          <TransactionsTable />
        </section>
      </main> */}
    </FormActionProvider>
  );
}
