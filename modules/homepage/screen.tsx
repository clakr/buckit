"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchBucketsByUserId } from "@/database/actions/bucket";
import ActionsDropdownMenu from "@/modules/homepage/features/actions-dropdown-menu";
import BucketsTabContent from "@/modules/homepage/features/buckets-tab-content";
import GoalsTabContent from "@/modules/homepage/features/goals-tab-content";
import OverviewTabContent from "@/modules/homepage/features/overview-tab-content";
import { FormActionProvider } from "@/modules/homepage/use-form-action";

export default function Screen({
  data,
}: {
  data: Awaited<ReturnType<typeof fetchBucketsByUserId>>;
}) {
  return (
    <FormActionProvider data={data}>
      <main className="mx-auto grid max-w-screen-xl gap-y-2 p-6">
        <header className="flex items-center justify-between">
          <h1 className="font-bold">Dashboard</h1>
          <ActionsDropdownMenu />
        </header>
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
    </FormActionProvider>
  );
}
