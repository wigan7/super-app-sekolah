import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/providers/SidebarProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIMAKS",
  description: "SIMAKS (Sistem Informasi Manajemen Administrasi Kepala Sekolah)",
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
        <SidebarProvider>
          <AuthProvider>
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-screen lg:min-h-0 w-full relative z-10">
              {children}
              <Footer />
            </main>
          </AuthProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
