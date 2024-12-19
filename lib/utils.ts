import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(input: number | string) {
  if (typeof input === "string") {
    input = parseFloat(input);
  }

  const currencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "php",
  });

  return currencyFormatter.format(input);
}
