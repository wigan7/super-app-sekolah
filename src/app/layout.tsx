import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Super App Kepala Sekolah",
  description: "Dashboard untuk Kepala Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col lg:flex-row bg-background text-foreground relative overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-screen lg:min-h-0 w-full relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
