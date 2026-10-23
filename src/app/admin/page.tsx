import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { readData } from "@/lib/db";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  const data = await readData();
  return <AdminDashboard data={data} />;
}
