"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Link2, FileCheck2, Percent } from "lucide-react";

type Indicator = {
  id: string;
  name: string;
};

type PKKSComponent = {
  id: string;
  title: string;
  indicators: Indicator[];
};

const pkksData: PKKSComponent[] = [
  {
    id: "kepribadian",
    title: "1. Kepribadian dan Sosial",
    indicators: [
      { id: "k1", name: "Jadwal sholat berjama'ah" },
      { id: "k2", name: "Kotak saran" },
      { id: "k3", name: "Notulen rapat" },
    ],
  },
  {
    id: "kepemimpinan",
    title: "2. Kepemimpinan Pembelajaran",
    indicators: [
      { id: "kp1", name: "Dokumen program sekolah (SMART)" },
      { id: "kp2", name: "Program pengembangan SDM" },
    ],
  },
  {
    id: "pengembangan",
    title: "3. Pengembangan Sekolah",
    indicators: [
      { id: "p1", name: "Rencana Kerja Sekolah (RKS)" },
      { id: "p2", name: "Analisis SWOT" },
    ],
  },
  {
    id: "manajemen",
    title: "4. Manajemen Sumber Daya",
    indicators: [
      { id: "m1", name: "Program pengelolaan pendidik" },
      { id: "m2", name: "Pengelolaan keuangan" },
    ],
  },
  {
    id: "kewirausahaan",
    title: "5. Kewirausahaan",
    indicators: [
      { id: "w1", name: "Dokumen karya inovatif" },
      { id: "w2", name: "Program pengembangan sekolah" },
    ],
  },
  {
    id: "supervisi",
    title: "6. Supervisi Pembelajaran",
    indicators: [
      { id: "s1", name: "Program supervisi akademik" },
      { id: "s2", name: "Jadwal instrumen supervisi" },
    ],
  },
];

export default function PKKSDashboard() {
  const [completedIndicators, setCompletedIndicators] = useState<Record<string, boolean>>({});
  const [links, setLinks] = useState<Record<string, string>>({});

  const totalIndicators = useMemo(() => {
    return pkksData.reduce((acc, curr) => acc + curr.indicators.length, 0);
  }, []);

  const completedCount = useMemo(() => {
    return Object.values(completedIndicators).filter(Boolean).length;
  }, [completedIndicators]);

  const progressPercentage = totalIndicators === 0 ? 0 : Math.round((completedCount / totalIndicators) * 100);

  const toggleIndicator = (id: string) => {
    setCompletedIndicators((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateLink = (id: string, value: string) => {
    setLinks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Penilaian Kinerja Kepala Sekolah
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <span className="font-medium text-gray-700">Wigan Anggit Utomo</span> 
            <span className="text-gray-400">|</span> 
            <span>SDN Mukiran 03</span>
          </p>
        </div>

        {/* Animated Progress Tracker */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-500" />
              Kelengkapan Bukti Fisik
            </h3>
            <div className="flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm">
              <Percent className="w-4 h-4" />
              <motion.span
                key={progressPercentage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {progressPercentage}
              </motion.span>
            </div>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ ease: "easeOut", duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content: Accordions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Accordion className="w-full">
          {pkksData.map((component, idx) => (
            <AccordionItem 
              value={component.id} 
              key={component.id} 
              className="border-b border-gray-100 last:border-0 px-6"
            >
              <AccordionTrigger className="hover:no-underline py-5 group">
                <div className="flex items-center text-left gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-100 transition-colors">
                    {idx + 1}
                  </div>
                  <span className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                    {component.title.substring(3)} {/* Remove number prefix from title as we use custom bubble */}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <div className="space-y-3">
                  {component.indicators.map((indicator) => {
                    const isChecked = !!completedIndicators[indicator.id];
                    return (
                      <div 
                        key={indicator.id}
                        className={`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300
                          ${isChecked 
                            ? 'bg-blue-50/50 border-blue-100' 
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm hover:bg-gray-50/50'
                          }`}
                      >
                        {/* Indicator Name */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg transition-colors ${isChecked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'}`}>
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <p className={`text-sm font-medium transition-all duration-300 truncate ${isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {indicator.name}
                          </p>
                        </div>

                        {/* Input & Checkbox */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="relative flex-1 md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Link2 className={`w-4 h-4 ${isChecked ? 'text-blue-400' : 'text-gray-400'}`} />
                            </div>
                            <Input
                              type="url"
                              placeholder="Google Drive Link..."
                              value={links[indicator.id] || ""}
                              onChange={(e) => updateLink(indicator.id, e.target.value)}
                              className={`pl-9 h-10 transition-all duration-300 border-x-0 border-t-0 border-b rounded-none focus-visible:ring-0 px-0 
                                ${isChecked 
                                  ? 'border-blue-200 bg-transparent text-blue-800 placeholder:text-blue-300 focus-visible:border-blue-400' 
                                  : 'border-gray-200 bg-transparent text-gray-700 focus-visible:border-gray-400 hover:border-gray-300'
                                }`}
                            />
                          </div>
                          
                          <div className="flex items-center justify-center shrink-0">
                            <Checkbox 
                              checked={isChecked}
                              onCheckedChange={() => toggleIndicator(indicator.id)}
                              className={`w-6 h-6 rounded-[6px] border-2 transition-all duration-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600
                                ${isChecked ? '' : 'border-gray-300 hover:border-blue-400'}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
