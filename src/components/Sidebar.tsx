"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  BookOpen, 
  FileCheck, 
  School, 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Kesiswaan", href: "/kesiswaan", icon: Users },
  { name: "Kepegawaian", href: "/kepegawaian", icon: UserCog },
  { name: "Pembelajaran", href: "/pembelajaran", icon: BookOpen },
  { name: "PKKS", href: "/pkks", icon: FileCheck },
  { name: "Identitas", href: "/identitas", icon: School },
];

export function Sidebar() {
  const pathname = usePathname();
  const [identitas, setIdentitas] = useState<{ namaKepalaSekolah?: string; namaSekolah?: string }>({});

  useEffect(() => {
    const fetchIdentitas = async () => {
      try {
        const res = await fetch("/api/identitas");
        if (res.ok) {
          const data = await res.json();
          setIdentitas(data || {});
        }
      } catch (error) {
        console.error("Gagal memuat data identitas di sidebar:", error);
      }
    };
    fetchIdentitas();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    // clean titles and filter empty parts
    const cleanParts = name
      .split(" ")
      .filter((n) => !n.includes(".") && n.length > 0);
    
    if (cleanParts.length === 0) return "?";
    if (cleanParts.length === 1) return cleanParts[0].slice(0, 2).toUpperCase();
    return (cleanParts[0][0] + cleanParts[1][0]).toUpperCase();
  };

  const namaKS = identitas.namaKepalaSekolah || "(Belum input Nama Kepala Sekolah)";
  const namaSekolah = identitas.namaSekolah || "(Belum input Nama Sekolah)";
  const initials = identitas.namaKepalaSekolah ? getInitials(identitas.namaKepalaSekolah) : "?";

  // Backup & Import States
  const [openBackup, setOpenBackup] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleExport = () => {
    window.location.href = "/api/backup";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError("");
    setImportSuccess(false);

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setFileError("Format berkas harus berupa JSON (.json)");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (typeof parsed !== "object" || parsed === null) {
          setFileError("Format berkas backup tidak valid.");
          return;
        }

        setImporting(true);
        const res = await fetch("/api/backup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        });

        if (res.ok) {
          setImportSuccess(true);
          setTimeout(() => {
            setOpenBackup(false);
            window.location.reload();
          }, 1500);
        } else {
          setFileError("Gagal mengimpor data. Server menolak berkas.");
        }
      } catch (err) {
        setFileError("Berkas rusak atau bukan format JSON yang valid.");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

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
      {/* Backup & Restore Data Trigger */}
      <div className="px-4 py-2 border-t border-slate-100/80 bg-slate-50/20">
        <Dialog open={openBackup} onOpenChange={setOpenBackup}>
          <DialogTrigger render={<button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200/50 shadow-2xs transition-all cursor-pointer" />}>
            <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Cadangkan / Ekspor Data</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Cadangkan & Pulihkan Data
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                Unduh seluruh data sekolah saat ini ke komputer Anda atau pulihkan dari berkas cadangan sebelumnya.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-4">
              {/* Export Area */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">1. Ekspor Data Sekolah (Backup)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Menyimpan seluruh identitas, kesiswaan, kepegawaian, dan PKKS ke format JSON.</span>
                </div>
                <Button 
                  onClick={handleExport}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold h-9 rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-2 w-full"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Berkas Cadangan (.json)
                </Button>
              </div>

              {/* Import Area */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">2. Impor Data Sekolah (Restore)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Unggah berkas cadangan (.json) untuk memulihkan seluruh data sebelumnya.</span>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={importing}
                  />
                  <div className={`border border-dashed rounded-lg p-4 text-center transition-colors flex flex-col items-center justify-center gap-2
                    ${importSuccess 
                      ? 'border-emerald-300 bg-emerald-50/30' 
                      : fileError 
                        ? 'border-rose-300 bg-rose-50/30' 
                        : 'border-slate-300 hover:border-indigo-400 bg-white'
                    }`}
                  >
                    {importing ? (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"
                        />
                        <span className="text-[10px] font-semibold text-slate-500">Sedang memproses data...</span>
                      </div>
                    ) : importSuccess ? (
                      <div className="flex flex-col items-center gap-1 text-emerald-600 py-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-bounce" />
                        <span className="text-[10px] font-bold">Impor Berhasil! Memuat ulang halaman...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-semibold text-slate-600">Klik untuk memilih berkas JSON backup</span>
                        <span className="text-[9px] text-slate-400">Hanya berkas valid dari aplikasi ini</span>
                      </>
                    )}
                  </div>
                </div>

                {fileError && (
                  <div className="flex items-start gap-1.5 text-[10px] text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4 border-t border-slate-200 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-800 truncate" title={namaKS}>
              {namaKS}
            </span>
            <span className="text-[10px] text-slate-400 truncate" title={namaSekolah}>
              {namaSekolah}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
