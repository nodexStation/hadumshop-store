"use client";
import { useState } from "react";
import { MailCheck } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("Please enter a valid email address."); return; }
    if (!consent) { setErr("Please tick the consent box so we know you want our emails."); return; }
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (res.ok) { setMsg("You're in! Watch your inbox for new drops and offers."); setEmail(""); setConsent(false); }
    else { const j = await res.json().catch(() => ({})); setErr(j.error || "Something went wrong — please try again."); }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="bg-espresso text-cream rounded-[2rem] px-6 py-12 sm:px-12 text-center">
        <MailCheck className="mx-auto text-goldsoft" size={34} />
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mt-4">New drops, first — in your inbox</h2>
        <p className="text-cream/70 mt-3 max-w-xl mx-auto">One thoughtful email when a new collection lands. No spam, no daily blasts — that's a promise.</p>
        <form onSubmit={submit} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address"
            className="flex-1 rounded-full px-5 py-3.5 text-espresso bg-cream outline-none focus:ring-2 ring-goldsoft" />
          <button className="rounded-full bg-gold px-7 py-3.5 font-semibold hover:bg-golddeep transition-colors">Subscribe</button>
        </form>
        <label className="mt-4 flex items-start justify-center gap-2 text-[13px] text-cream/70 max-w-lg mx-auto text-left sm:text-center">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[#a67c2e]" />
          I agree to receive HADUM Shop news and offers by email. Unsubscribe anytime.
        </label>
        {err && <p className="mt-3 text-red-300 text-sm" role="alert">{err}</p>}
        {msg && <p className="mt-3 text-goldsoft font-medium" role="status">{msg}</p>}
      </div>
    </section>
  );
}
