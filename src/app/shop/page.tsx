import { Suspense } from "react";
import type { Metadata } from "next";
import { readData } from "@/lib/db";
import ShopClient from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Shop HADUM premium lifestyle products — heritage craft, modern design, clear prices in taka, Cash on Delivery across Bangladesh.",
};
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const data = await readData();
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-16">Loading shop…</div>}>
      <ShopClient products={data.products} categories={data.categories} />
    </Suspense>
  );
}
