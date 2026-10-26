// Shared phone helpers: the stored form is 01XXXXXXXXX (see POST /api/orders).
export function normalizePhone(raw: string): string {
  let p = String(raw || "").replace(/[\s-]/g, "");
  if (p.startsWith("+880")) p = `0${p.slice(4)}`;
  else if (p.startsWith("880")) p = `0${p.slice(3)}`;
  return p;
}

export function maskPhone(phone: string): string {
  if (phone.length < 7) return "****";
  return `${phone.slice(0, 4)}****${phone.slice(-2)}`;
}
