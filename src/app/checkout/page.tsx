import type { Metadata } from "next";
import { readData } from "@/lib/db";
import CheckoutClient from "@/components/CheckoutClient";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const data = await readData();
  return <CheckoutClient settings={data.settings} />;
}
