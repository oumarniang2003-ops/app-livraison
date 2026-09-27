import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yeggo — Livraison de colis à Dakar en temps réel",
  description: "Envoyez et suivez vos colis à Dakar en vrai temps réel avec géolocalisation directe.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-neutral-900 selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
