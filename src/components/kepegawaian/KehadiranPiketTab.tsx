"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getDatasetRows,
  appendDatasetRow,
  deleteDatasetRow,
  importDatasetRows
} from "@/lib/clientDb";

type IzinRow = {
  id: string;
  tanggal: string;
  nama: string;
  tujuan: string;
  keperluan: string;
  berangkat: string;
  kembali: string;
  tipe?: string;
  tanggalKembali?: string;
};

type PiketRow = {
  id: string;
  tanggal: string;
  nama: string;
  uraian: string;
  keterangan: string;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_IZIN = {
  tanggal: "",
  nama: "",
  tujuan: "",
  keperluan: "",
  berangkat: "",
  kembali: "",
  tipe: "Setengah Hari",
  tanggalKembali: "",
};

const EMPTY_PIKET = {
  tanggal: "",
  nama: "",
  uraian: "",
  keterangan: "",
};

export function KehadiranPiketTab() {
  const [izinRows, setIzinRows] = useState<IzinRow[]>([]);
  const [piketRows, setPiketRows] = useState<PiketRow[]>([]);
  const [openIzin, setOpenIzin] = useState(false);
  const [openPiket, setOpenPiket] = useState(false);
  const [izinForm, setIzinForm] = useState(EMPTY_IZIN);
  const [piketForm, setPiketForm] = useState(EMPTY_PIKET);
  const [pegawaiList, setPegawaiList] = useState<any[]>([]);
  const [editingIzinId, setEditingIzinId] = useState<string | null>(null);
  const [editingPiketId, setEditingPiketId] = useState<string | null>(null);

  const fetchRows = () => {
    try {
      const izinData = getDatasetRows("kepegawaian", "izinKeluar");
      const piketData = getDatasetRows("kepegawaian", "piket");
      
      setIzinRows(Array.isArray(izinData) ? (izinData as IzinRow[]) : []);
      setPiketRows(Array.isArray(piketData) ? (piketData as PiketRow[]) : []);
    } catch (error) {
      console.error("Gagal memuat data izin/piket:", error);
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

  // Helper formatting tanggal lokal
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
  }, []);

  const saveIzin = () => {
    const isEdit = !!editingIzinId;
    
    try {
      if (isEdit) {
        const updated = izinRows.map(r => r.id === editingIzinId ? { ...r, ...izinForm } : r);
        importDatasetRows("kepegawaian", "izinKeluar", updated, "overwrite");
      } else {
        appendDatasetRow("kepegawaian", "izinKeluar", izinForm);
      }

      setIzinForm(EMPTY_IZIN);
      setEditingIzinId(null);
      setOpenIzin(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} izin`);
    }
  };

  const deleteIzin = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data izin keluar ini?")) return;
    try {
      deleteDatasetRow("kepegawaian", "izinKeluar", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const savePiket = () => {
    const isEdit = !!editingPiketId;
    
    try {
      if (isEdit) {
        const updated = piketRows.map(r => r.id === editingPiketId ? { ...r, ...piketForm } : r);
        importDatasetRows("kepegawaian", "piket", updated, "overwrite");
      } else {
        appendDatasetRow("kepegawaian", "piket", piketForm);
      }

      setPiketForm(EMPTY_PIKET);
      setEditingPiketId(null);
      setOpenPiket(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} piket`);
    }
  };

  const deletePiket = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan piket ini?")) return;
    try {
      deleteDatasetRow("kepegawaian", "piket", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-slate-900">Buku Izin Keluar</CardTitle>
            <CardDescription>Pencatatan guru/pegawai yang izin keluar saat jam kerja.</CardDescription>
          </div>
          <Dialog open={openIzin} onOpenChange={setOpenIzin}>
            <DialogTrigger render={<Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 transition-colors" onClick={() => { setIzinForm(EMPTY_IZIN); setEditingIzinId(null); }} />}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah Izin
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-slate-200">
              <DialogHeader>
                <DialogTitle>{editingIzinId ? "Edit Izin Keluar" : "Form Izin Keluar"}</DialogTitle>
                <DialogDescription>
                  Masukkan detail izin keluar guru atau pegawai.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="inama-select">Pilih Guru / Pegawai</Label>
                  <select
                    id="inama-select"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      const val = e.target.value;
                      setIzinForm((prev) => ({ ...prev, nama: val }));
                    }}
                    value={izinForm.nama}
                  >
                    <option value="">-- Pilih Pegawai --</option>
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
                  <Input id="inama" placeholder="Nama / NIP pegawai" value={izinForm.nama} onChange={(e) => setIzinForm((prev) => ({ ...prev, nama: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipe">Status Izin Keluar</Label>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tipe"
                        value="Setengah Hari"
                        checked={izinForm.tipe === "Setengah Hari" || !izinForm.tipe}
                        onChange={() => setIzinForm((prev) => ({ ...prev, tipe: "Setengah Hari", tanggalKembali: "" }))}
                        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      Setengah Hari
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tipe"
                        value="Full"
                        checked={izinForm.tipe === "Full"}
                        onChange={() => setIzinForm((prev) => ({ ...prev, tipe: "Full", berangkat: "", kembali: "", tanggalKembali: "" }))}
                        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      Penuh (Full Day)
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tipe"
                        value="Beberapa Hari"
                        checked={izinForm.tipe === "Beberapa Hari"}
                        onChange={() => setIzinForm((prev) => ({ ...prev, tipe: "Beberapa Hari", berangkat: "", kembali: "" }))}
                        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      Beberapa Hari
                    </label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="itanggal">
                    {izinForm.tipe === "Beberapa Hari" ? "Tanggal Berangkat" : "Hari/Tanggal"}
                  </Label>
                  <Input id="itanggal" type="date" value={izinForm.tanggal} onChange={(e) => setIzinForm((prev) => ({ ...prev, tanggal: e.target.value }))} />
                </div>
                {izinForm.tipe === "Beberapa Hari" && (
                  <div className="grid gap-2">
                    <Label htmlFor="itanggalkembali">Tanggal Kembali (Pulang)</Label>
                    <Input id="itanggalkembali" type="date" value={izinForm.tanggalKembali} onChange={(e) => setIzinForm((prev) => ({ ...prev, tanggalKembali: e.target.value }))} />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="tujuan">Tujuan</Label>
                  <Input id="tujuan" value={izinForm.tujuan} onChange={(e) => setIzinForm((prev) => ({ ...prev, tujuan: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="keperluan">Keperluan</Label>
                  <Input id="keperluan" value={izinForm.keperluan} onChange={(e) => setIzinForm((prev) => ({ ...prev, keperluan: e.target.value }))} />
                </div>
                {izinForm.tipe === "Setengah Hari" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="berangkat">Berangkat</Label>
                      <Input id="berangkat" type="time" value={izinForm.berangkat} onChange={(e) => setIzinForm((prev) => ({ ...prev, berangkat: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="kembali">Kembali</Label>
                      <Input id="kembali" type="time" value={izinForm.kembali} onChange={(e) => setIzinForm((prev) => ({ ...prev, kembali: e.target.value }))} />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenIzin(false)}>Batal</Button>
                <Button type="button" onClick={saveIzin}>Simpan Izin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-100 overflow-hidden mt-4">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-32 text-xs">Hari/Tanggal</TableHead>
                  <TableHead className="text-xs">Nama/NIP</TableHead>
                  <TableHead className="text-xs">Tujuan & Keperluan</TableHead>
                  <TableHead className="text-xs">Waktu</TableHead>
                  <TableHead className="w-20 text-xs text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {izinRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">Belum ada data izin.</TableCell>
                  </TableRow>
                ) : (
                  izinRows.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-slate-50"
                    >
                      <TableCell className="text-xs text-slate-600 align-top pt-3">
                        {item.tipe === "Beberapa Hari" && item.tanggalKembali ? (
                          <div className="space-y-0.5">
                            <div>{formatDate(item.tanggal)}</div>
                            <div className="text-[10px] text-slate-400">s/d</div>
                            <div>{formatDate(item.tanggalKembali)}</div>
                          </div>
                        ) : (
                          formatDate(item.tanggal)
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-900 align-top pt-3">{item.nama}</TableCell>
                      <TableCell className="text-xs align-top pt-3">
                        <div className="font-medium text-slate-900">{item.tujuan}</div>
                        <div className="text-slate-500 mt-0.5">{item.keperluan}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 align-top pt-3">
                        {item.tipe === "Full" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-800">
                            Full Day
                          </span>
                        ) : item.tipe === "Beberapa Hari" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-100 text-teal-800">
                            Beberapa Hari
                          </span>
                        ) : (
                          `${item.berangkat} - ${item.kembali}`
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-right align-top pt-2">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setIzinForm({
                                tanggal: item.tanggal || "",
                                nama: item.nama || "",
                                tujuan: item.tujuan || "",
                                keperluan: item.keperluan || "",
                                berangkat: item.berangkat || "",
                                kembali: item.kembali || "",
                                tipe: item.tipe || "Setengah Hari",
                                tanggalKembali: item.tanggalKembali || "",
                              });
                              setEditingIzinId(item.id);
                              setOpenIzin(true);
                            }}
                            className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteIzin(item.id)}
                            className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Buku Piket Guru</CardTitle>
            <CardDescription>Laporan harian pelaksanaan piket oleh guru.</CardDescription>
          </div>
          <Dialog open={openPiket} onOpenChange={setOpenPiket}>
            <DialogTrigger render={<Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 transition-colors" onClick={() => { setPiketForm(EMPTY_PIKET); setEditingPiketId(null); }} />}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah Piket
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-slate-200">
              <DialogHeader>
                <DialogTitle>{editingPiketId ? "Edit Laporan Piket" : "Form Piket Guru"}</DialogTitle>
                <DialogDescription>
                  Masukkan laporan piket harian guru.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="ptanggal">Hari/Tanggal</Label>
                  <Input id="ptanggal" type="date" value={piketForm.tanggal} onChange={(e) => setPiketForm((prev) => ({ ...prev, tanggal: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pnama-select">Pilih Guru Piket</Label>
                  <select
                    id="pnama-select"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      const val = e.target.value;
                      setPiketForm((prev) => ({ ...prev, nama: val }));
                    }}
                    value={piketForm.nama}
                  >
                    <option value="">-- Pilih Guru Piket --</option>
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
                  <Input id="pnama" placeholder="Nama Guru Piket" value={piketForm.nama} onChange={(e) => setPiketForm((prev) => ({ ...prev, nama: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="puraian">Uraian</Label>
                  <Input id="puraian" value={piketForm.uraian} onChange={(e) => setPiketForm((prev) => ({ ...prev, uraian: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pket">Keterangan</Label>
                  <Input id="pket" value={piketForm.keterangan} onChange={(e) => setPiketForm((prev) => ({ ...prev, keterangan: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenPiket(false)}>Batal</Button>
                <Button type="button" onClick={savePiket}>Simpan Piket</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-100 overflow-hidden mt-4">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-32 text-xs">Hari/Tanggal</TableHead>
                  <TableHead className="text-xs">Guru Piket</TableHead>
                  <TableHead className="text-xs">Uraian & Ket</TableHead>
                  <TableHead className="w-20 text-xs text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {piketRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">Belum ada data piket.</TableCell>
                  </TableRow>
                ) : (
                  piketRows.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-slate-50"
                    >
                      <TableCell className="text-xs text-slate-600 align-top pt-3">{formatDate(item.tanggal)}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-900 align-top pt-3">{item.nama}</TableCell>
                      <TableCell className="text-xs align-top pt-3">
                        <div className="font-medium text-slate-900">{item.uraian}</div>
                        <div className="text-slate-500 mt-0.5">{item.keterangan}</div>
                      </TableCell>
                      <TableCell className="text-xs text-right align-top pt-2">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setPiketForm({
                                tanggal: item.tanggal || "",
                                nama: item.nama || "",
                                uraian: item.uraian || "",
                                keterangan: item.keterangan || "",
                              });
                              setEditingPiketId(item.id);
                              setOpenPiket(true);
                            }}
                            className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deletePiket(item.id)}
                            className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
