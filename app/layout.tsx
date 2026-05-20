import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { FooterGate } from "@/components/FooterGate";
import { AuthProvider } from "@/components/AuthProvider";
import { getCurrentUser } from "@/lib/session";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "SKYLONZE — Predict the future with SKY-3030",
  description:
    "SKYLONZE is a futuristic digital prediction market where you forecast crypto, stocks, sports, tech, startups, and viral events using SKY-3030 coins.",
  keywords: [
    "prediction market", "SKY-3030", "SKYLONZE", "forecasting",
    "crypto", "stocks", "startups", "leaderboard", "digital coin"
  ],
  openGraph: {
    title: "SKYLONZE",
    description:
      "Predict crypto, stocks, sports, tech, startups & trending events. Earn SKY-3030. Climb the leaderboard.",
    type: "website",
    images: ["/skylonze-logo.png"],
  },
  icons: {
    icon: [
      { url: "/skylonze-logo.png", type: "image/png" },
    ],
    apple: "/skylonze-logo.png",
    shortcut: "/skylonze-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#06030F",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await getCurrentUser();
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-violet-700 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <AuthProvider initialUser={initialUser as any}>
          <Nav />
          <main id="main" className="relative">{children}</main>
          <FooterGate />
        </AuthProvider>
      </body>
    </html>
  );
}
