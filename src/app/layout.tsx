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
  title: "EM DAILY",
  description: "Daily & Weekly Tracker for EMPHASIS",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EM DAILY",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#030712",
};

import { BackgroundMusic } from "@/components/audio/BackgroundMusic";
import { AuthProvider } from "@/lib/AuthContext";
import { FirebaseSyncProvider } from "@/components/auth/FirebaseSyncProvider";

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
        <AuthProvider>
          <FirebaseSyncProvider>
            <main className="w-full max-w-md min-h-screen relative overflow-x-hidden pt-4 pb-24 bg-background shadow-[0_0_40px_rgba(212,175,55,0.05)] flex flex-col">
              {children}
            </main>
            <BottomNav />
            <BackgroundMusic />
          </FirebaseSyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
