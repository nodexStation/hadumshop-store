import type { Metadata } from "next";
import { Instagram, Mail, MapPin } from "lucide-react";
import { readData } from "@/lib/db";

export const metadata: Metadata = { title: "Contact", description: "Contact HADUM Shop — Instagram DM, email, Khulna, Bangladesh." };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const data = await readData();
  const s = data.settings;
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold">Contact Us</h1>
      <p className="text-espresso/75 mt-4 text-lg">The fastest way to reach us is an Instagram DM — we reply there first, including for order questions (just send your order number).</p>
      <div className="grid sm:grid-cols-3 gap-4 mt-9">
        <a href={s.instagram} target="_blank" rel="noopener" className="bg-white border border-linen rounded-3xl p-6 card-hover block">
          <Instagram className="text-golddeep" size={26} />
          <h2 className="font-display text-xl font-semibold mt-3">Instagram DM</h2>
          <p className="text-warmgrey text-[15px] mt-1">@hadumshop — fastest replies</p>
        </a>
        <a href={`mailto:${s.email}`} className="bg-white border border-linen rounded-3xl p-6 card-hover block">
          <Mail className="text-golddeep" size={26} />
          <h2 className="font-display text-xl font-semibold mt-3">Email</h2>
          <p className="text-warmgrey text-[15px] mt-1">{s.email}</p>
        </a>
        <div className="bg-white border border-linen rounded-3xl p-6">
          <MapPin className="text-golddeep" size={26} />
          <h2 className="font-display text-xl font-semibold mt-3">Based in</h2>
          <p className="text-warmgrey text-[15px] mt-1">Khulna, Bangladesh — delivering nationwide</p>
        </div>
      </div>
      <div className="bg-band border border-linen rounded-3xl p-6 mt-8 text-[15px] text-espresso/80">
        <p><strong>Order help:</strong> include your order number (e.g. HDM-20261023-0001) in your message so we can find your order immediately.</p>
        <p className="mt-2"><strong>Returns:</strong> see the <a className="underline font-medium" href="/policies/returns">returns &amp; refund policy</a> before messaging — most answers are there.</p>
      </div>
    </div>
  );
}
