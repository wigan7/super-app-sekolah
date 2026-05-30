"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, UserCog, BookOpen, FileCheck } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Kesiswaan", href: "/kesiswaan", icon: Users },
  { name: "Kepegawaian", href: "/kepegawaian", icon: UserCog },
  { name: "Pembelajaran", href: "/pembelajaran", icon: BookOpen },
  { name: "PKKS", href: "/pkks", icon: FileCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Super App Sekolah
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-slate-100 rounded-md"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
            KS
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">Kepala Sekolah</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
