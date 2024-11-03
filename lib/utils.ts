import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Transaction } from "~/server/database/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyFormatter = Intl.NumberFormat("en-PH", {
  currency: "PHP",
  style: "currency",
});

export function formatTransactionAmountBasedOnType({
  amount,
  type,
}: Pick<Transaction, "amount" | "type">) {
  amount = currencyFormatter.format(+amount);

  if (type === "inbound") {
    return `+${amount}`;
  } else if (type === "outbound") {
    return `-${amount}`;
  }

  return amount;
}
