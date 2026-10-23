import type { MetadataRoute } from "next";
import { readData } from "@/lib/db";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await readData();
  const staticPages = ["", "/shop", "/about", "/contact", "/policies/shipping", "/policies/returns", "/policies/privacy", "/policies/terms"]
    .map((p) => ({ url: `${SITE}${p}`, lastModified: new Date() }));
  const products = data.products.map((p) => ({
    url: `${SITE}/product/${p.slug}`,
    lastModified: new Date(p.createdAt),
  }));
  return [...staticPages, ...products];
}
