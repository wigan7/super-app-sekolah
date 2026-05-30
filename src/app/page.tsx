"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, FileCheck } from "lucide-react";

const summaryData = [
  {
    title: "Total Siswa",
    value: "80",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Total Guru",
    value: "10",
    icon: UserCog,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    title: "Progress PKKS",
    value: "75%",
    icon: FileCheck,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

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
  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Selamat Datang, Kepala Sekolah
            </h1>
            <p className="text-slate-500 mt-2">
              Berikut adalah ringkasan informasi sekolah hari ini.
            </p>
          </motion.div>
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
                whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" }}
                whileTap={{ scale: 0.98 }}
                className="transition-shadow duration-300 rounded-xl bg-white"
              >
                <Card className="border-slate-200/60 shadow-sm h-full bg-transparent">
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
