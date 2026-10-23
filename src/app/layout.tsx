import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { readData } from "@/lib/db";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "HADUM Shop — Rooted in Heritage. Designed for Modern Life", template: "%s | HADUM Shop" },
  description: "HADUM Shop is a premium lifestyle brand from Khulna, Bangladesh. Heritage craft, minimal timeless design, honest prices. Cash on Delivery available.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "HADUM Shop",
    title: "HADUM Shop — Rooted in Heritage. Designed for Modern Life",
    description: "Premium lifestyle, crafted in Bangladesh. Shop HADUM with Cash on Delivery.",
    images: ["/brand/hero-brand.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await readData();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <Header settings={data.settings} />
          <main>{children}</main>
          <Footer settings={data.settings} categories={data.categories} />
        </CartProvider>
      </body>
    </html>
  );
}
