"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setBusy(false);
    if (res.ok) { router.refresh(); }
    else setErr("Wrong password. (Local demo default is in README.md — change ADMIN_PASSWORD before going live.)");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <form onSubmit={login} className="bg-white border border-linen rounded-[2rem] p-8">
        <Lock className="text-golddeep" size={30} />
        <h1 className="font-display text-3xl font-semibold mt-4">Store Admin</h1>
        <p className="text-warmgrey text-[15px] mt-1.5">Protected area — HADUM Shop owner only.</p>
        <label className="font-semibold text-sm tracking-wide block mt-6 mb-1.5" htmlFor="admin-pw">Admin password</label>
        <input id="admin-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-linen px-4 py-3 outline-none focus:border-gold" autoComplete="current-password" />
        {err && <p className="text-red-700 text-sm mt-2" role="alert">{err}</p>}
        <button disabled={busy} className="w-full bg-espresso text-cream rounded-full py-3.5 font-semibold mt-5 hover:bg-golddeep disabled:opacity-50">{busy ? "Checking…" : "Log in"}</button>
      </form>
    </div>
  );
}
