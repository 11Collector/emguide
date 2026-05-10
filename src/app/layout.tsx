import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";

const kanitFont = Kanit({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EM GUIDE",
  description: "Daily & Weekly Tracker for EMPHASIS",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EM GUIDE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kanitFont.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full bg-[#030712] text-slate-50 flex justify-center selection:bg-blue-500/30">
        <main className="w-full max-w-md min-h-screen relative overflow-x-hidden pt-4 pb-24 bg-background shadow-[0_0_40px_rgba(212,175,55,0.05)] flex flex-col">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
