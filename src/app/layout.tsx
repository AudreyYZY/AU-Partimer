import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AU-Partimer | Part-time Job Risk Checker",
  description:
    "Practical screening tool for Australian part-time workers to assess job opportunities, spot workplace risks, and choose safer next steps.",
  keywords: [
    "fair work",
    "australia",
    "workplace rights",
    "underpayment",
    "international students",
    "casual workers",
  ],
};

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <DisclaimerBanner />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
