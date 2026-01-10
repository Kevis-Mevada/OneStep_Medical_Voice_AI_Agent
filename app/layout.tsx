import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Onestep Medical Voice AI",
  description:
    "Secure, voice-based health guidance assistant providing calm, non-diagnostic medical information.",
  icons: {
    icon: "/logo.jpeg",  // Use existing logo as application icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-[#F8FAFC] text-slate-900`}
      >
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
