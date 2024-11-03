<script setup lang="ts">
import { definePageMeta, useFetch } from "#imports";
import Template from "./template.vue";
import {
  PlusIcon,
  DividerHorizontalIcon,
  PlusCircledIcon,
  MinusCircledIcon,
} from "@radix-icons/vue";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import {
  currencyFormatter,
  formatTransactionAmountBasedOnType,
} from "~/lib/utils";

definePageMeta({
  middleware: "auth",
  auth: {
    guestRedirectUrl: "/login",
  },
  layout: "auth",
});

const { status, error, data } = useFetch("/api/home");
</script>

<template>
  <main class="mx-auto grid max-w-screen-lg gap-y-8 px-3 py-6">
    <Template v-if="status === 'pending'">
      <template #buckets>
        <p>loading...</p>
      </template>
      <template #transactions>
        <p>loading...</p>
      </template>
    </Template>
    <p v-else-if="status === 'error'">{{ error }}</p>
    <Template v-else-if="data">
      <template #buckets>
        <div
          class="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4"
        >
          <Card v-for="bucket in data.buckets" :key="bucket.id">
            <CardHeader>
              <CardTitle>{{ bucket.name }}</CardTitle>
              <CardDescription>{{ bucket.description }}</CardDescription>
            </CardHeader>
            <CardFooter class="justify-self-end font-bold">
              {{ currencyFormatter.format(+bucket.totalAmount) }}
            </CardFooter>
          </Card>
          <button type="button">
            <Card
              class="grid h-full place-content-center hover:bg-primary/5 py-4"
            >
              <PlusIcon class="size-16" />
            </Card>
          </button>
        </div>
      </template>
      <template #transactions>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bucket</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="transaction in data.transactions"
              :key="transaction.id"
              :class="[
                transaction.type === 'default' &&
                  '[--type-color:theme(colors.neutral.600)]',
                transaction.type === 'inbound' &&
                  '[--type-color:theme(colors.green.600)]',
                transaction.type === 'outbound' &&
                  '[--type-color:theme(colors.red.600)]',
              ]"
            >
              <TableCell class="text-[var(--type-color)]">
                <DividerHorizontalIcon v-if="transaction.type === 'default'" />
                <PlusCircledIcon v-else-if="transaction.type === 'inbound'" />
                <MinusCircledIcon v-else />
              </TableCell>
              <TableCell>
                {{ transaction.description }}
              </TableCell>
              <TableCell
                class="font-bold text-[var(--type-color)] tabular-nums"
              >
                {{
                  formatTransactionAmountBasedOnType({
                    amount: transaction.amount,
                    type: transaction.type,
                  })
                }}
              </TableCell>
              <TableCell class="font-medium">
                {{ transaction.bucket.name }}
              </TableCell>
              <TableCell>
                {{ transaction.createdAt }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </template>
    </Template>
  </main>
</template>
