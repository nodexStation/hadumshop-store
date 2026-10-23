import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdmin } from "@/lib/auth";

// POST /api/admin/upload — image upload for the admin dashboard.
// Local mode: saves under public/uploads/. Production: use Supabase Storage
// bucket "products" and paste the public URL into the product form instead.
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (!/^image\/(jpeg|png|webp|svg\+xml)$/.test(file.type))
    return NextResponse.json({ error: "Only JPG, PNG, WebP or SVG images are allowed." }, { status: 422 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 422 });
  const ext = file.type === "image/svg+xml" ? "svg" : file.type.split("/")[1].replace("jpeg", "jpg");
  const name = `upload-${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, url: `/uploads/${name}` }, { status: 201 });
}
