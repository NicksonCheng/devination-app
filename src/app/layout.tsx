import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/components/LoadingContext";

export const metadata: Metadata = {
  title: "命定香氣探索 | Soulmate Scent",
  description: "透過塔羅牌，探索你的命定香氣",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased bg-[#0B1021] text-amber-100 min-h-screen">
        <LoadingProvider>{children}</LoadingProvider>
      </body>
    </html>
  );
}
