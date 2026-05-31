import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 relative overflow-x-hidden">
        {/* Ambient Gradient Blobs for premium Glassmorphism */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/15 blur-3xl pointer-events-none z-0" />
        
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-screen lg:min-h-0 w-full relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
