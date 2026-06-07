"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="py-4 text-center text-xs font-medium text-slate-500 border-t border-slate-200/60 bg-white/50 backdrop-blur-md mt-auto z-20">
      &copy; 2026 SIMAKS by Pak Candra
    </footer>
  );
}
