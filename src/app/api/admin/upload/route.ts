import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdmin } from "@/lib/auth";

// POST /api/admin/upload — image upload for the admin dashboard (admin only).
// SVG is NOT accepted: an uploaded SVG is served as an active document and
// can carry script, so it is an XSS vector even from a compromised admin
// session. Only raster images (JPG/PNG/WebP) are allowed, and the file's
// magic bytes must match its claimed type — a renamed script or SVG must
// not pass by lying about its MIME type.
// Local mode: saves under public/uploads/. Production: use Supabase Storage
// bucket "products" and paste the public URL into the product form instead.
const ALLOWED = [
  { type: "image/jpeg", ext: "jpg", magic: [0xff, 0xd8, 0xff] },
  { type: "image/png", ext: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  // WebP: "RIFF" at 0, "WEBP" at 8.
  { type: "image/webp", ext: "webp", magic: null as number[] | null },
] as const;

function matchesMagic(bytes: Buffer, kind: (typeof ALLOWED)[number]): boolean {
  if (kind.type === "image/webp") {
    return bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  }
  const magic = kind.magic as unknown as number[];
  return bytes.length >= magic.length && magic.every((b, i) => bytes[i] === b);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  const kind = ALLOWED.find((k) => k.type === file.type);
  if (!kind) return NextResponse.json({ error: "Only JPG, PNG or WebP images are allowed." }, { status: 422 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 422 });
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!matchesMagic(bytes, kind))
    return NextResponse.json({ error: "File contents do not match its image type." }, { status: 422 });
  const name = `upload-${Date.now()}.${kind.ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ ok: true, url: `/uploads/${name}` }, { status: 201 });
}
