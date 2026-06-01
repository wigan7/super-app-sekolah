"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, AlertCircle, Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getDatasetRows,
  appendDatasetRow,
  deleteDatasetRow,
  importDatasetRows,
  getIdentitas
} from "@/lib/clientDb";

type SupervisiRow = {
  id: string;
  tanggal: string;
  guru: string;
  kelas: string;
  mapel: string;
  aspek: string;
  hasil: string;
  saran: string;
  status: string;
};

type AdministrasiRow = {
  id: string;
  guru: string;
  mapel: string;
  kelengkapan: {
    silabus: boolean;
    rpp: boolean;
    prota: boolean;
    promes: boolean;
  };
  hasil: string;
};

const EMPTY_SUPERVISI = {
  tanggal: "",
  guru: "",
  kelas: "",
  mapel: "",
  aspek: "",
  hasil: "",
  saran: "",
  status: "Tindak Lanjut",
};

const EMPTY_ADMIN = {
  guru: "",
  mapel: "",
  silabus: true,
  rpp: true,
  prota: true,
  promes: true,
  hasil: "Lengkap & Sesuai",
};

export default function TabSupervisi() {
  const [supervisiRows, setSupervisiRows] = useState<SupervisiRow[]>([]);
  const [administrasiRows, setAdministrasiRows] = useState<AdministrasiRow[]>([]);
  const [pegawaiList, setPegawaiList] = useState<any[]>([]);
  const [openSupervisi, setOpenSupervisi] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [supervisiForm, setSupervisiForm] = useState(EMPTY_SUPERVISI);
  const [adminForm, setAdminForm] = useState(EMPTY_ADMIN);
  const [namaSekolah, setNamaSekolah] = useState("");
  const [editingSupervisiId, setEditingSupervisiId] = useState<string | null>(null);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  const fetchRows = () => {
    try {
      const supervisiData = getDatasetRows("pembelajaran", "supervisi");
      const adminData = getDatasetRows("pembelajaran", "administrasi");
      
      setSupervisiRows(Array.isArray(supervisiData) ? (supervisiData as SupervisiRow[]) : []);
      setAdministrasiRows(Array.isArray(adminData) ? (adminData as AdministrasiRow[]) : []);
    } catch (error) {
      console.error("Gagal memuat data supervisi:", error);
    }
  };

  const fetchPegawaiList = () => {
    try {
      const data = getDatasetRows("kepegawaian", "pegawai");
      setPegawaiList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat list pegawai:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
    fetchPegawaiList();

    const fetchSchoolName = () => {
      try {
        const data = getIdentitas();
        setNamaSekolah(data?.namaSekolah || "");
      } catch (error) {
        console.error("Gagal memuat nama sekolah di supervisi:", error);
      }
    };
    fetchSchoolName();
  }, []);

  const saveSupervisi = () => {
    const isEdit = !!editingSupervisiId;
    
    try {
      if (isEdit) {
        const updated = supervisiRows.map(r => r.id === editingSupervisiId ? { ...r, ...supervisiForm } : r);
        importDatasetRows("pembelajaran", "supervisi", updated, "overwrite");
      } else {
        appendDatasetRow("pembelajaran", "supervisi", supervisiForm);
      }

      setSupervisiForm(EMPTY_SUPERVISI);
      setEditingSupervisiId(null);
      setOpenSupervisi(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} supervisi`);
    }
  };

  const deleteSupervisi = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data supervisi ini?")) return;
    try {
      deleteDatasetRow("pembelajaran", "supervisi", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const saveAdministrasi = () => {
    const payload = {
      guru: adminForm.guru,
      mapel: adminForm.mapel,
      kelengkapan: {
        silabus: adminForm.silabus,
        rpp: adminForm.rpp,
        prota: adminForm.prota,
        promes: adminForm.promes,
      },
      hasil: adminForm.hasil,
    };

    const isEdit = !!editingAdminId;
    try {
      if (isEdit) {
        const updated = administrasiRows.map(r => r.id === editingAdminId ? { ...r, ...payload } : r);
        importDatasetRows("pembelajaran", "administrasi", updated, "overwrite");
      } else {
        appendDatasetRow("pembelajaran", "administrasi", payload);
      }

      setAdminForm(EMPTY_ADMIN);
      setEditingAdminId(null);
      setOpenAdmin(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} administrasi`);
    }
  };

  const deleteAdministrasi = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data administrasi ini?")) return;
    try {
      deleteDatasetRow("pembelajaran", "administrasi", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-end gap-2">
        <Dialog open={openSupervisi} onOpenChange={setOpenSupervisi}>
          <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => { setSupervisiForm(EMPTY_SUPERVISI); setEditingSupervisiId(null); }}><Plus className="mr-2 h-4 w-4" /> Input Supervisi</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSupervisiId ? "Edit Supervisi" : "Input Supervisi Baru"}</DialogTitle>
              <DialogDescription>Catat hasil supervisi kelas.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="stanggal">Hari/Tanggal</Label>
                <Input id="stanggal" type="date" value={supervisiForm.tanggal} onChange={(e) => setSupervisiForm((prev) => ({ ...prev, tanggal: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sguru-select">Pilih Guru</Label>
                <select
                  id="sguru-select"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => {
                    const val = e.target.value;
                    setSupervisiForm((prev) => ({ ...prev, guru: val }));
                  }}
                  value={supervisiForm.guru}
                >
                  <option value="">-- Pilih Guru --</option>
                  {pegawaiList.map((p) => {
                    const label = p.nip && p.nip !== "-" ? `${p.nama} - NIP. ${p.nip}` : p.nama;
                    return (
                      <option key={p.id} value={label}>
                        {label} ({p.jabatan || ""})
                      </option>
                    );
                  })}
                </select>
                <div className="text-[10px] text-slate-400">Atau ketik nama kustom secara manual di bawah:</div>
                <Input id="sguru" placeholder="Nama / NIP guru" value={supervisiForm.guru} onChange={(e) => setSupervisiForm((prev) => ({ ...prev, guru: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2"><Label htmlFor="skelas">Kelas</Label><Input id="skelas" value={supervisiForm.kelas} onChange={(e) => setSupervisiForm((prev) => ({ ...prev, kelas: e.target.value }))} /></div>
                <div className="grid gap-2"><Label htmlFor="smapel">Mapel</Label><Input id="smapel" value={supervisiForm.mapel} onChange={(e) => setSupervisiForm((prev) => ({ ...prev, mapel: e.target.value }))} /></div>
              </div>
              <div className="grid gap-2"><Label htmlFor="saspek">Aspek Supervisi</Label><Input id="saspek" value={supervisiForm.aspek} onChange={(e) => setSupervisiForm((prev) => ({ ...prev, aspek: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="shasil">Hasil</Label><Input id="shasil" value={supervisiForm.hasil} onChange={(e) => setSupervisiForm((prev) => ({ ...prev, hasil: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="ssaran">Refleksi</Label><Input id="ssaran" placeholder="Refleksi tindak lanjut" value={supervisiForm.saran} onChange={(e) => setSupervisiForm((prev) => ({ ...prev, saran: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="sstatus">Tindak Lanjut</Label><Input id="sstatus" placeholder="Status tindak lanjut" value={supervisiForm.status} onChange={(e) => setSupervisiForm((prev) => ({ ...prev, status: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpenSupervisi(false)}>Batal</Button><Button onClick={saveSupervisi}>Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openAdmin} onOpenChange={setOpenAdmin}>
          <DialogTrigger render={<Button variant="outline" onClick={() => { setAdminForm(EMPTY_ADMIN); setEditingAdminId(null); }}><Plus className="mr-2 h-4 w-4" /> Input Administrasi</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAdminId ? "Edit Administrasi" : "Input Administrasi Guru"}</DialogTitle>
              <DialogDescription>Catat pemeriksaan kelengkapan perangkat pembelajaran.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="aguru-select">Pilih Guru</Label>
                <select
                  id="aguru-select"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => {
                    const val = e.target.value;
                    setAdminForm((prev) => ({ ...prev, guru: val }));
                  }}
                  value={adminForm.guru}
                >
                  <option value="">-- Pilih Guru --</option>
                  {pegawaiList.map((p) => {
                    const label = p.nip && p.nip !== "-" ? `${p.nama} - NIP. ${p.nip}` : p.nama;
                    return (
                      <option key={p.id} value={label}>
                        {label} ({p.jabatan || ""})
                      </option>
                    );
                  })}
                </select>
                <div className="text-[10px] text-slate-400">Atau ketik nama kustom secara manual di bawah:</div>
                <Input id="aguru" placeholder="Nama / NIP guru" value={adminForm.guru} onChange={(e) => setAdminForm((prev) => ({ ...prev, guru: e.target.value }))} />
              </div>
              <div className="grid gap-2"><Label htmlFor="amapel">Mapel</Label><Input id="amapel" value={adminForm.mapel} onChange={(e) => setAdminForm((prev) => ({ ...prev, mapel: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={adminForm.silabus} onChange={(e) => setAdminForm((prev) => ({ ...prev, silabus: e.target.checked }))} />Silabus</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={adminForm.rpp} onChange={(e) => setAdminForm((prev) => ({ ...prev, rpp: e.target.checked }))} />RPP</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={adminForm.prota} onChange={(e) => setAdminForm((prev) => ({ ...prev, prota: e.target.checked }))} />Prota</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={adminForm.promes} onChange={(e) => setAdminForm((prev) => ({ ...prev, promes: e.target.checked }))} />Promes</label>
              </div>
              <div className="grid gap-2"><Label htmlFor="ahasil">Hasil Pemeriksaan</Label><Input id="ahasil" value={adminForm.hasil} onChange={(e) => setAdminForm((prev) => ({ ...prev, hasil: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpenAdmin(false)}>Batal</Button><Button onClick={saveAdministrasi}>Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Supervisi Kelas</CardTitle>
          <CardDescription>Jadwal dan hasil supervisi akademik di {namaSekolah || "(Belum input Nama Sekolah)"}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                  <TableHead className="font-medium text-slate-500 w-37.5">Hari/Tanggal</TableHead>
                  <TableHead className="font-medium text-slate-500">Nama Guru</TableHead>
                  <TableHead className="font-medium text-slate-500">Kelas</TableHead>
                  <TableHead className="font-medium text-slate-500">Mapel</TableHead>
                  <TableHead className="font-medium text-slate-500">Aspek Disupervisi</TableHead>
                  <TableHead className="font-medium text-slate-500">Hasil & Refleksi</TableHead>
                  <TableHead className="font-medium text-slate-500 text-right">Tindak Lanjut</TableHead>
                  <TableHead className="font-medium text-slate-500 text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supervisiRows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="h-24 text-center text-slate-500">Belum ada data supervisi.</TableCell></TableRow>
                ) : (
                  supervisiRows.map((row) => (
                    <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{formatDate(row.tanggal)}</TableCell>
                      <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.guru}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.kelas}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.mapel}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.aspek}</TableCell>
                      <TableCell className="py-4"><div className="text-sm font-medium text-slate-900 dark:text-slate-100">{row.hasil}</div><div className="text-xs text-slate-500 mt-0.5">{row.saran}</div></TableCell>
                      <TableCell className="py-4 text-right"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.status === "Selesai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>{row.status}</span></TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setSupervisiForm({
                                tanggal: row.tanggal || "",
                                guru: row.guru || "",
                                kelas: row.kelas || "",
                                mapel: row.mapel || "",
                                aspek: row.aspek || "",
                                hasil: row.hasil || "",
                                saran: row.saran || "",
                                status: row.status || "Tindak Lanjut",
                              });
                              setEditingSupervisiId(row.id);
                              setOpenSupervisi(true);
                            }}
                            className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSupervisi(row.id)}
                            className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pemeriksaan Administrasi & Persiapan</CardTitle>
          <CardDescription>Pengecekan kelengkapan perangkat pembelajaran guru.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                  <TableHead className="font-medium text-slate-500">Nama Guru</TableHead>
                  <TableHead className="font-medium text-slate-500">Mapel</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Silabus</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">RPP</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Prota</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Promes</TableHead>
                  <TableHead className="font-medium text-slate-500 text-right">Hasil Pemeriksaan</TableHead>
                  <TableHead className="font-medium text-slate-500 text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {administrasiRows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="h-24 text-center text-slate-500">Belum ada data administrasi.</TableCell></TableRow>
                ) : (
                  administrasiRows.map((row) => (
                    <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.guru}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.mapel}</TableCell>
                      <TableCell className="py-4 text-center">{row.kelengkapan.silabus ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />}</TableCell>
                      <TableCell className="py-4 text-center">{row.kelengkapan.rpp ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />}</TableCell>
                      <TableCell className="py-4 text-center">{row.kelengkapan.prota ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />}</TableCell>
                      <TableCell className="py-4 text-center">{row.kelengkapan.promes ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />}</TableCell>
                      <TableCell className="py-4 text-right"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.hasil === "Lengkap & Sesuai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"}`}>{row.hasil}</span></TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setAdminForm({
                                guru: row.guru || "",
                                mapel: row.mapel || "",
                                silabus: !!row.kelengkapan?.silabus,
                                rpp: !!row.kelengkapan?.rpp,
                                prota: !!row.kelengkapan?.prota,
                                promes: !!row.kelengkapan?.promes,
                                hasil: row.hasil || "Lengkap & Sesuai",
                              });
                              setEditingAdminId(row.id);
                              setOpenAdmin(true);
                            }}
                            className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteAdministrasi(row.id)}
                            className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
