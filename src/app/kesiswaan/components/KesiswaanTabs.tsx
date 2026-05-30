"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TabInduk from "./TabInduk";
import TabKehadiran from "./TabKehadiran";
import TabMutasi from "./TabMutasi";
import TabAkademik from "./TabAkademik";

const TABS = [
  { id: "induk", label: "Data Induk & Pendaftaran" },
  { id: "kehadiran", label: "Kehadiran" },
  { id: "mutasi", label: "Mutasi" },
  { id: "akademik", label: "Akademik & Kelulusan" },
];

export default function KesiswaanTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Navigation */}
      <div className="relative flex w-full space-x-1 overflow-x-auto rounded-xl bg-slate-100/50 p-1 dark:bg-slate-800/50 sm:w-fit">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative rounded-lg px-4 py-2.5 text-sm font-medium transition-colors outline-none",
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-white shadow-sm dark:bg-slate-800"
                  style={{ borderRadius: 8 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[400px]">
        {activeTab === "induk" && <TabInduk />}
        {activeTab === "kehadiran" && <TabKehadiran />}
        {activeTab === "mutasi" && <TabMutasi />}
        {activeTab === "akademik" && <TabAkademik />}
      </div>
    </div>
  );
}
