"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ClipboardList, Award, Box } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataPegawaiTab } from "@/components/kepegawaian/DataPegawaiTab";
import { KehadiranPiketTab } from "@/components/kepegawaian/KehadiranPiketTab";
import { PengembanganPrestasiTab } from "@/components/kepegawaian/PengembanganPrestasiTab";
import { InventarisTab } from "@/components/kepegawaian/InventarisTab";

const tabs = [
  { id: "data-pegawai", label: "Data & Penilaian Pegawai", icon: Users },
  { id: "kehadiran", label: "Kehadiran & Piket", icon: ClipboardList },
  { id: "prestasi", label: "Pengembangan & Prestasi", icon: Award },
  { id: "inventaris", label: "Inventaris", icon: Box },
];

export default function KepegawaianPage() {
  const [activeTab, setActiveTab] = useState("data-pegawai");

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kepegawaian</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manajemen data guru, pegawai, penilaian, kehadiran, dan inventaris sekolah.
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 inline-flex w-full sm:w-auto justify-start overflow-x-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="rounded-lg px-4 py-2"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <TabsContent value="data-pegawai" className="mt-0 outline-none">
                <DataPegawaiTab />
              </TabsContent>
              <TabsContent value="kehadiran" className="mt-0 outline-none">
                <KehadiranPiketTab />
              </TabsContent>
              <TabsContent value="prestasi" className="mt-0 outline-none">
                <PengembanganPrestasiTab />
              </TabsContent>
              <TabsContent value="inventaris" className="mt-0 outline-none">
                <InventarisTab />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
