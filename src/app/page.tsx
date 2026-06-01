"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, FileCheck } from "lucide-react";
import { getDataKesiswaan, getDataKepegawaian, getDataPkks, getIdentitas } from "@/lib/clientDb";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalSiswa: "0",
    totalGuru: "0",
    pkksProgress: "0%",
  });
  const [identitas, setIdentitas] = useState<{ namaKepalaSekolah?: string; namaSekolah?: string; logoSekolah?: string }>({});

  useEffect(() => {
    const fetchData = () => {
      try {
        const siswa = getDataKesiswaan();
        const guru = getDataKepegawaian();
        const pkks = getDataPkks();
        
        let pkksProgress = 0;
        if (pkks && pkks.completedIndicators) {
          const completedCount = Object.values(pkks.completedIndicators).filter(Boolean).length;
          const totalIndicators = 13;
          pkksProgress = Math.round((completedCount / totalIndicators) * 100);
        }

        setDashboardData({
          totalSiswa: siswa.length.toString(),
          totalGuru: guru.length.toString(),
          pkksProgress: `${pkksProgress}%`,
        });

        const idData = getIdentitas();
        setIdentitas(idData || {});
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const summaryData = [
    {
      title: "Total Siswa",
      value: dashboardData.totalSiswa,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Guru",
      value: dashboardData.totalGuru,
      icon: UserCog,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Progress PKKS",
      value: dashboardData.pkksProgress,
      icon: FileCheck,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1"
          >
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Selamat Datang, {identitas.namaKepalaSekolah || "(Belum input Nama Kepala Sekolah)"}
            </h1>
            <p className="text-slate-500 mt-2">
              Berikut adalah ringkasan informasi {identitas.namaSekolah || "(Belum input Nama Sekolah)"} hari ini.
            </p>
          </motion.div>
          {identitas.logoSekolah && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200/85 p-2.5 shadow-sm flex items-center justify-center shrink-0"
            >
              <div className="relative w-full h-full">
                <Image src={identitas.logoSekolah} alt="Logo Sekolah" fill className="object-contain" />
              </div>
            </motion.div>
          )}
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {summaryData.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {item.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${item.bg}`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{item.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
