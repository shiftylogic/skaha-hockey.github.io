import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jr. Thunderbirds 12U A2 Stats",
  description: "Team statistics and coaching resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        <Providers>
          <Navbar />
          <FilterBar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}