"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/providers/SidebarProvider";
import { useAuth } from "@/providers/AuthProvider";
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
  AlertTriangle,
  Trash2,
  PanelLeft,
  PanelLeftClose,
  UserCircle,
  LogOut,
  Printer,
  CloudUpload,
  CloudDownload,
  Loader2
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
import { getIdentitas, resetSchoolData, getSchoolData, writeSchoolData } from "@/lib/clientDb";
import { saveDataToCloud, loadDataFromCloud } from "@/lib/cloudSync";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Kesiswaan", href: "/kesiswaan", icon: Users },
  { name: "Kepegawaian", href: "/kepegawaian", icon: UserCog },
  { name: "Pembelajaran", href: "/pembelajaran", icon: BookOpen },
  { name: "PKKS", href: "/pkks", icon: FileCheck },
  { name: "Identitas", href: "/identitas", icon: School },
  { name: "Cetak Dokumen", href: "/cetak", icon: Printer },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const [identitas, setIdentitas] = useState<{ namaKepalaSekolah?: string; namaSekolah?: string; fotoKepalaSekolah?: string }>({});

  useEffect(() => {
    const fetchIdentitas = () => {
      try {
        const data = getIdentitas();
        setIdentitas(data || {});
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
  const initials = getInitials(identitas.namaKepalaSekolah);

  // Backup & Import States
  const [openBackup, setOpenBackup] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [fileError, setFileError] = useState("");
  const [cloudSaving, setCloudSaving] = useState(false);
  const [cloudSaveSuccess, setCloudSaveSuccess] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudLoadSuccess, setCloudLoadSuccess] = useState(false);

  const [openReset, setOpenReset] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  // Logout States
  const [openLogout, setOpenLogout] = useState(false);

  // Confirm Dialogs
  const [openConfirmCloudSave, setOpenConfirmCloudSave] = useState(false);
  const [openConfirmCloudLoad, setOpenConfirmCloudLoad] = useState(false);
  const [openConfirmLocalLoad, setOpenConfirmLocalLoad] = useState(false);
  const [pendingLocalData, setPendingLocalData] = useState<any>(null);

  const handleExport = () => {
    try {
      const data = getSchoolData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date().toISOString().split("T")[0];
      a.download = `backup-super-app-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal melakukan export:", err);
      alert("Gagal mengunduh backup data.");
    }
  };

  const handleCloudSave = async () => {
    if (!user) return;
    try {
      setCloudSaving(true);
      setCloudSaveSuccess(false);
      setFileError("");
      const data = getSchoolData();
      await saveDataToCloud(user.uid, data);
      setCloudSaveSuccess(true);
      setTimeout(() => setCloudSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Gagal menyimpan ke cloud:", err);
      setFileError(err.message || "Gagal menyimpan data ke Cloud.");
    } finally {
      setCloudSaving(false);
    }
  };

  const handleCloudLoad = async () => {
    if (!user) return;
    try {
      setCloudLoading(true);
      setCloudLoadSuccess(false);
      setFileError("");
      const data = await loadDataFromCloud(user.uid);
      writeSchoolData(data);
      setCloudLoadSuccess(true);
      setTimeout(() => {
        setOpenBackup(false);
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error("Gagal memuat dari cloud:", err);
      setFileError(err.message || "Gagal memuat data dari Cloud.");
    } finally {
      setCloudLoading(false);
    }
  };

  const handleReset = () => {
    if (resetConfirmText !== "RESET") return;

    setResetting(true);
    setResetError("");
    try {
      resetSchoolData();
      setResetSuccess(true);
      setTimeout(() => {
        setOpenReset(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      setResetError("Terjadi kesalahan koneksi.");
    } finally {
      setResetting(false);
    }
  };

  const processLocalLoad = async (parsed: any) => {
    try {
      setImporting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      writeSchoolData(parsed);
      setImportSuccess(true);
      setTimeout(() => {
        setOpenBackup(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      setFileError("Terjadi kesalahan saat memproses data.");
    } finally {
      setImporting(false);
    }
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

        setPendingLocalData(parsed);
        setOpenConfirmLocalLoad(true);
      } catch (err) {
        setFileError("Berkas rusak atau bukan format JSON yang valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (pathname === "/login") {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2.5 rounded-xl ios-glass border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer print:hidden"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}

      <motion.aside 
        initial={false}
        animate={{ width: isOpen ? 224 : 0, opacity: isOpen ? 1 : 0 }}
        className="border-r border-slate-200/60 ios-glass h-screen sticky top-0 flex flex-col z-40 overflow-hidden shrink-0 print:hidden"
      >
        <div className="w-56 flex flex-col h-full">
          <div className="p-5 flex items-center justify-between">
            <div className="flex-1 flex justify-center items-center pr-2">
              <img 
                src="/logo-simaks.png" 
                alt="SIMAKS Logo" 
                className="object-contain w-full h-auto max-w-40 drop-shadow-sm" 
              />
            </div>
            <button 
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors active:scale-95 shrink-0"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "text-primary font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
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
      <div className="px-4 py-2 border-t border-slate-200/60 flex flex-col gap-2">
        {/* Reset All Data Trigger */}
        <Dialog open={openReset} onOpenChange={(val) => { setOpenReset(val); if(!val) { setResetConfirmText(""); setResetError(""); setResetSuccess(false); } }}>
          <DialogTrigger render={<button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent transition-all cursor-pointer" />}>
            <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="truncate">Reset Semua Data</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[32px] ios-glass border border-slate-200/60 p-6">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                Hapus & Reset Semua Data?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Seluruh data kesiswaan, kepegawaian, pembelajaran, PKKS, dan identitas sekolah akan dihapus secara permanen.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-600">
                  Ketik <span className="font-bold text-rose-600 font-mono">RESET</span> di bawah untuk mengonfirmasi:
                </label>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  placeholder="RESET"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono"
                  disabled={resetting || resetSuccess}
                />
              </div>

              {resetError && (
                <div className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Data berhasil di-reset! Memuat ulang halaman...</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenReset(false)}
                  className="flex-1 text-xs h-10 rounded-xl border-slate-200"
                  disabled={resetting || resetSuccess}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  disabled={resetConfirmText !== "RESET" || resetting || resetSuccess}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-xs font-semibold h-10 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  {resetting ? "Mereset..." : "Ya, Reset Semua"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialogs */}
        <Dialog open={openConfirmCloudSave} onOpenChange={setOpenConfirmCloudSave}>
          <DialogContent className="sm:max-w-md rounded-[32px] ios-glass border border-slate-200/60 p-6">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CloudUpload className="w-5 h-5 text-primary" />
                Konfirmasi Simpan ke Cloud
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menyimpan data ke Cloud? Tindakan ini akan <strong>menimpa (overwrite)</strong> penyimpanan data sebelumnya.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2.5 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenConfirmCloudSave(false)}
                className="flex-1 text-xs h-10 rounded-xl border-slate-200 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setOpenConfirmCloudSave(false);
                  handleCloudSave();
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-10 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                Ya, Simpan Data
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openConfirmCloudLoad} onOpenChange={setOpenConfirmCloudLoad}>
          <DialogContent className="sm:max-w-md rounded-[32px] ios-glass border border-slate-200/60 p-6">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CloudDownload className="w-5 h-5 text-indigo-600" />
                Konfirmasi Muat dari Cloud
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin memuat data dari Cloud? Tindakan ini akan <span className="text-rose-600 font-bold">menghapus dan menimpa</span> semua data lokal Anda saat ini.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2.5 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenConfirmCloudLoad(false)}
                className="flex-1 text-xs h-10 rounded-xl border-slate-200 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setOpenConfirmCloudLoad(false);
                  handleCloudLoad();
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold h-10 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                Ya, Muat Data
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openConfirmLocalLoad} onOpenChange={(val) => {
          setOpenConfirmLocalLoad(val);
          if (!val) setPendingLocalData(null);
        }}>
          <DialogContent className="sm:max-w-md rounded-[32px] ios-glass border border-slate-200/60 p-6">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                Konfirmasi Impor Lokal
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin memuat data dari berkas lokal ini? Tindakan ini akan <span className="text-rose-600 font-bold">menghapus dan menimpa</span> semua data lokal Anda saat ini.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2.5 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenConfirmLocalLoad(false)}
                className="flex-1 text-xs h-10 rounded-xl border-slate-200 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setOpenConfirmLocalLoad(false);
                  if (pendingLocalData) {
                    processLocalLoad(pendingLocalData);
                    setPendingLocalData(null);
                  }
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-10 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                Ya, Impor Data
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openBackup} onOpenChange={setOpenBackup}>
          <DialogTrigger render={<button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-all cursor-pointer" />}>
            <Database className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">Cadangkan / Ekspor</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[32px] ios-glass border border-slate-200/60 p-6">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Cadangkan & Pulihkan Data
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                Unduh seluruh data sekolah saat ini ke komputer Anda atau pulihkan dari berkas cadangan sebelumnya.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-4">
              {/* Export Area */}
              <div className="bg-white/50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">1. Ekspor Data Sekolah (Backup)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Menyimpan seluruh identitas, kesiswaan, kepegawaian, dan PKKS.</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleExport}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold h-10 rounded-xl cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Lokal (.json)
                  </Button>
                  <Button 
                    onClick={() => setOpenConfirmCloudSave(true)}
                    disabled={cloudSaving || cloudSaveSuccess}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-10 rounded-xl cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    {cloudSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : cloudSaveSuccess ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <CloudUpload className="w-4 h-4" />
                    )}
                    {cloudSaving ? "Menyimpan..." : cloudSaveSuccess ? "Berhasil!" : "Simpan ke Cloud"}
                  </Button>
                </div>
              </div>

              {/* Import Area */}
              <div className="bg-white/50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">2. Impor Data Sekolah (Restore)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Pulihkan seluruh data dari berkas lokal (.json) atau dari Cloud.</span>
                </div>

                <Button 
                  onClick={() => setOpenConfirmCloudLoad(true)}
                  disabled={cloudLoading || cloudLoadSuccess}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold h-10 rounded-xl cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  {cloudLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : cloudLoadSuccess ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <CloudDownload className="w-4 h-4" />
                  )}
                  {cloudLoading ? "Memuat..." : cloudLoadSuccess ? "Berhasil!" : "Muat dari Cloud"}
                </Button>

                <div className="relative mt-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={importing}
                  />
                  <div className={`border rounded-xl p-4 text-center transition-colors flex flex-col items-center justify-center gap-2
                    ${importSuccess 
                      ? 'border-emerald-300 bg-emerald-50' 
                      : fileError && !cloudSaving && !cloudLoading
                        ? 'border-rose-300 bg-rose-50' 
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {importing ? (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                        />
                        <span className="text-[10px] font-semibold text-slate-500">Sedang memproses data lokal...</span>
                      </div>
                    ) : importSuccess ? (
                      <div className="flex flex-col items-center gap-1 text-emerald-600 py-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-bounce" />
                        <span className="text-[10px] font-bold">Impor Lokal Berhasil! Memuat ulang...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-semibold text-slate-600">Atau klik untuk memilih berkas JSON lokal</span>
                      </>
                    )}
                  </div>
                </div>

                {fileError && (
                  <div className="flex items-start gap-1.5 text-[10px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4 border-t border-slate-200/60 mt-auto">
        <div className="flex items-center gap-2">
          <Link href="/identitas" className="flex-1 flex items-center gap-3 px-3 py-2 overflow-hidden bg-white/50 hover:bg-slate-100 rounded-xl border border-slate-200/50 transition-colors cursor-pointer group min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden relative border border-slate-300">
              {identitas.fotoKepalaSekolah ? (
                <Image src={identitas.fotoKepalaSekolah} alt="Foto Profil" fill className="object-cover" />
              ) : (
                <span className="text-primary font-bold text-xs">{initials}</span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-primary transition-colors" title={namaKS}>
                {namaKS}
              </span>
              <span className="text-[10px] text-slate-500 truncate" title={namaSekolah}>
                {namaSekolah}
              </span>
            </div>
          </Link>
          <Dialog open={openLogout} onOpenChange={setOpenLogout}>
            <DialogTrigger render={
              <button
                title="Keluar"
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all active:scale-95 cursor-pointer"
              />
            }>
              <LogOut className="w-4 h-4" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[32px] ios-glass border border-slate-200/60 p-6">
              <DialogHeader className="space-y-1.5">
                <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-rose-600" />
                  Konfirmasi Keluar
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda sudah <strong>menyimpan data (Backup ke Cloud)</strong>?
                  <br /><br />
                  Melanjutkan keluar akan <span className="text-rose-600 font-bold">MENGHAPUS SEMUA DATA LOKAL</span> dari perangkat ini untuk mencegah konflik saat login menggunakan akun lain.
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-2.5 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenLogout(false)}
                  className="flex-1 text-xs h-10 rounded-xl border-slate-200 cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    setOpenLogout(false);
                    try {
                      resetSchoolData();
                      await logout();
                    } catch (err) {
                      console.error("Logout error", err);
                    }
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-10 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  Ya, Keluar & Hapus Data
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
        </div>
      </motion.aside>
    </>
  );
}
