"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ExternalLink, Edit } from "lucide-react";

type PrestasiRow = {
  id: string;
  nama: string;
  jenis: string;
  tingkat: string;
  juara: string;
  tahun: string;
};

type KenaikanRow = {
  id: string;
  kelas: string;
  jumlahSiswa: string;
  siswaNaik: string;
  siswaTinggal: string;
  prosentase: string;
};

type RaportRow = {
  id: string;
  kelas: string;
  sudahDiserahkan: string;
  belumDiserahkan: string;
  jumlahSiswa: string;
  prosentase: string;
};

type IjazahRow = {
  id: string;
  kelas: string;
  nama: string;
  nis: string;
  nisn: string;
  noIjazah: string;
  tanggalPenyerahan: string;
  keterangan: string;
};

const EMPTY_FORM = {
  nama: "",
  jenis: "",
  tingkat: "",
  juara: "",
  tahun: "",
};

const EMPTY_KENAIKAN_FORM = {
  kelas: "",
  jumlahSiswa: "",
  siswaNaik: "",
  siswaTinggal: "",
  prosentase: "",
};

const EMPTY_RAPORT_FORM = {
  kelas: "",
  sudahDiserahkan: "",
  belumDiserahkan: "",
  jumlahSiswa: "",
  prosentase: "",
};

export default function TabAkademik() {
  const [rows, setRows] = useState<PrestasiRow[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingPrestasiId, setEditingPrestasiId] = useState<string | null>(null);

  // Kenaikan Kelas States
  const [kenaikanRows, setKenaikanRows] = useState<KenaikanRow[]>([]);
  const [formKenaikan, setFormKenaikan] = useState(EMPTY_KENAIKAN_FORM);
  const [savingKenaikan, setSavingKenaikan] = useState(false);
  const [openKenaikan, setOpenKenaikan] = useState(false);
  const [editingKenaikanId, setEditingKenaikanId] = useState<string | null>(null);

  // Rekapitulasi TKA & PSAJ States
  const [rekapLink, setRekapLink] = useState<string>("");
  const [inputLink, setInputLink] = useState<string>("");
  const [savingRekap, setSavingRekap] = useState(false);
  const [openRekap, setOpenRekap] = useState(false);

  // Penyerahan Raport States
  const [raportRows, setRaportRows] = useState<RaportRow[]>([]);
  const [formRaport, setFormRaport] = useState(EMPTY_RAPORT_FORM);
  const [savingRaport, setSavingRaport] = useState(false);
  const [openRaport, setOpenRaport] = useState(false);
  const [editingRaportId, setEditingRaportId] = useState<string | null>(null);

  // Penyerahan Ijazah States
  const [ijazahRows, setIjazahRows] = useState<IjazahRow[]>([]);
  const [openIjazah, setOpenIjazah] = useState(false);
  const [savingIjazah, setSavingIjazah] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [ijazahInputList, setIjazahInputList] = useState<any[]>([]);

  // Penyerahan Ijazah Edit Row States
  const [editingIjazahRow, setEditingIjazahRow] = useState<IjazahRow | null>(null);
  const [openEditIjazah, setOpenEditIjazah] = useState(false);

  // Student list data for importing class
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [uniqueClasses, setUniqueClasses] = useState<string[]>([]);

  const fetchRows = async () => {
    try {
      const res = await fetch("/api/data/kesiswaan/akademikPrestasi");
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data akademik:", error);
    }
  };

  const fetchKenaikanRows = async () => {
    try {
      const res = await fetch("/api/data/kesiswaan/akademikKenaikan");
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setKenaikanRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data kenaikan kelas:", error);
    }
  };

  const fetchRekapLink = async () => {
    try {
      const res = await fetch("/api/data/kesiswaan/rekapUjian");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const latest = data[data.length - 1];
        setRekapLink(latest.link || "");
        setInputLink(latest.link || "");
      }
    } catch (error) {
      console.error("Gagal memuat link rekapitulasi TKA/PSAJ:", error);
    }
  };

  const fetchRaportRows = async () => {
    try {
      const res = await fetch("/api/data/kesiswaan/penyerahanRaport");
      if (!res.ok) return;
      const data = await res.json();
      setRaportRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data penyerahan raport:", error);
    }
  };

  const fetchIjazahRows = async () => {
    try {
      const res = await fetch("/api/data/kesiswaan/penyerahanIjazah");
      if (!res.ok) return;
      const data = await res.json();
      setIjazahRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data penyerahan ijazah:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/kesiswaan");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllStudents(data);
          const classes = Array.from(new Set(data.map((s: any) => s.kelas).filter(Boolean))) as string[];
          setUniqueClasses(classes.sort());
        }
      }
    } catch (error) {
      console.error("Gagal memuat data siswa:", error);
    }
  };

  useEffect(() => {
    fetchRows();
    fetchKenaikanRows();
    fetchRekapLink();
    fetchRaportRows();
    fetchIjazahRows();
    fetchStudents();
  }, []);

  // Prestasi Handlers
  const handleSubmit = async () => {
    setSaving(true);
    try {
      let res;
      if (editingPrestasiId) {
        const updated = rows.map((item) => (item.id === editingPrestasiId ? { ...item, ...form } : item));
        res = await fetch("/api/data/kesiswaan/akademikPrestasi?mode=overwrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } else {
        res = await fetch("/api/data/kesiswaan/akademikPrestasi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        alert("Gagal menyimpan data prestasi.");
        return;
      }

      setForm(EMPTY_FORM);
      setEditingPrestasiId(null);
      setOpen(false);
      await fetchRows();
    } catch (error) {
      console.error("Gagal menyimpan data akademik:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditPrestasi = (item: PrestasiRow) => {
    setForm({
      nama: item.nama,
      jenis: item.jenis,
      tingkat: item.tingkat,
      juara: item.juara,
      tahun: item.tahun,
    });
    setEditingPrestasiId(item.id);
    setOpen(true);
  };

  const handleDeletePrestasi = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data prestasi ini?")) return;
    try {
      const res = await fetch(`/api/data/kesiswaan/akademikPrestasi?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchRows();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // Kenaikan Kelas Handlers
  const handleKenaikanChange = (field: string, value: string) => {
    setFormKenaikan((prev) => {
      const nextForm = { ...prev, [field]: value };
      
      const naik = parseInt(field === "siswaNaik" ? value : nextForm.siswaNaik) || 0;
      const tinggal = parseInt(field === "siswaTinggal" ? value : nextForm.siswaTinggal) || 0;
      let total = parseInt(field === "jumlahSiswa" ? value : nextForm.jumlahSiswa) || 0;
      
      if (field === "siswaNaik" || field === "siswaTinggal") {
        total = naik + tinggal;
        nextForm.jumlahSiswa = total.toString();
      }
      
      const pct = total > 0 ? ((naik / total) * 100).toFixed(2) : "0";
      nextForm.prosentase = pct + "%";
      
      return nextForm;
    });
  };

  const handleSubmitKenaikan = async () => {
    if (!formKenaikan.kelas) {
      alert("Kelas wajib diisi.");
      return;
    }
    setSavingKenaikan(true);
    try {
      let res;
      if (editingKenaikanId) {
        const updated = kenaikanRows.map((item) => (item.id === editingKenaikanId ? { ...item, ...formKenaikan } : item));
        res = await fetch("/api/data/kesiswaan/akademikKenaikan?mode=overwrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } else {
        res = await fetch("/api/data/kesiswaan/akademikKenaikan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formKenaikan),
        });
      }

      if (!res.ok) {
        alert("Gagal menyimpan data kenaikan kelas.");
        return;
      }

      setFormKenaikan(EMPTY_KENAIKAN_FORM);
      setEditingKenaikanId(null);
      setOpenKenaikan(false);
      await fetchKenaikanRows();
    } catch (error) {
      console.error("Gagal menyimpan data kenaikan:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSavingKenaikan(false);
    }
  };

  const handleEditKenaikan = (item: KenaikanRow) => {
    setFormKenaikan({
      kelas: item.kelas,
      jumlahSiswa: item.jumlahSiswa,
      siswaNaik: item.siswaNaik,
      siswaTinggal: item.siswaTinggal,
      prosentase: item.prosentase,
    });
    setEditingKenaikanId(item.id);
    setOpenKenaikan(true);
  };

  const handleDeleteKenaikan = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data kenaikan kelas ini?")) return;
    try {
      const res = await fetch(`/api/data/kesiswaan/akademikKenaikan?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchKenaikanRows();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmitRekap = async () => {
    setSavingRekap(true);
    try {
      const res = await fetch("/api/data/kesiswaan/rekapUjian?mode=overwrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ id: "rekap-link", link: inputLink }]),
      });

      if (!res.ok) {
        alert("Gagal menyimpan link Google Drive.");
        return;
      }

      setOpenRekap(false);
      await fetchRekapLink();
    } catch (error) {
      console.error("Gagal menyimpan link:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setSavingRekap(false);
    }
  };

  const handleDeleteRekap = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus link Google Drive ini?")) return;
    try {
      const res = await fetch("/api/data/kesiswaan/rekapUjian?mode=overwrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
      if (res.ok) {
        setRekapLink("");
        setInputLink("");
      } else {
        alert("Gagal menghapus link.");
      }
    } catch (error) {
      console.error("Error deleting rekap link:", error);
    }
  };

  // Penyerahan Raport Handlers
  const handleRaportChange = (field: string, value: string) => {
    setFormRaport((prev) => {
      const nextForm = { ...prev, [field]: value };
      
      const sudah = parseInt(field === "sudahDiserahkan" ? value : nextForm.sudahDiserahkan) || 0;
      const belum = parseInt(field === "belumDiserahkan" ? value : nextForm.belumDiserahkan) || 0;
      const total = sudah + belum;
      
      nextForm.jumlahSiswa = total.toString();
      
      const pct = total > 0 ? ((sudah / total) * 100).toFixed(2) : "0";
      nextForm.prosentase = pct + "%";
      
      return nextForm;
    });
  };

  const handleSubmitRaport = async () => {
    if (!formRaport.kelas) {
      alert("Kelas wajib diisi.");
      return;
    }
    setSavingRaport(true);
    try {
      let res;
      if (editingRaportId) {
        const updated = raportRows.map((item) => (item.id === editingRaportId ? { ...item, ...formRaport } : item));
        res = await fetch("/api/data/kesiswaan/penyerahanRaport?mode=overwrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } else {
        res = await fetch("/api/data/kesiswaan/penyerahanRaport", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formRaport),
        });
      }

      if (!res.ok) {
        alert("Gagal menyimpan data penyerahan raport.");
        return;
      }

      setFormRaport(EMPTY_RAPORT_FORM);
      setEditingRaportId(null);
      setOpenRaport(false);
      await fetchRaportRows();
    } catch (error) {
      console.error("Gagal menyimpan data penyerahan raport:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setSavingRaport(false);
    }
  };

  const handleEditRaport = (item: RaportRow) => {
    setFormRaport({
      kelas: item.kelas,
      sudahDiserahkan: item.sudahDiserahkan,
      belumDiserahkan: item.belumDiserahkan,
      jumlahSiswa: item.jumlahSiswa,
      prosentase: item.prosentase,
    });
    setEditingRaportId(item.id);
    setOpenRaport(true);
  };

  const handleDeleteRaport = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data penyerahan raport ini?")) return;
    try {
      const res = await fetch(`/api/data/kesiswaan/penyerahanRaport?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchRaportRows();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // Penyerahan Ijazah Handlers
  const handleImportClassForIjazah = () => {
    if (!selectedClass) {
      alert("Silakan pilih kelas terlebih dahulu.");
      return;
    }
    const filtered = allStudents.filter((s: any) => s.kelas === selectedClass);
    if (filtered.length === 0) {
      alert(`Tidak ada data siswa di kelas ${selectedClass} pada Buku Induk.`);
      return;
    }
    const list = filtered.map((s: any) => ({
      nama: s.nama || "",
      nis: s.nis || "",
      nisn: s.nisn || "",
      noIjazah: "",
      tanggalPenyerahan: "",
      keterangan: ""
    }));
    setIjazahInputList(list);
  };

  const handleIjazahInputChange = (index: number, field: string, value: string) => {
    setIjazahInputList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleIjazahInputPaste = (e: React.ClipboardEvent<HTMLInputElement>, rowIndex: number, field: string) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text");
    const rows = clipboardData.split(/\r?\n/).map(r => r.trim()).filter(r => r !== "");
    
    setIjazahInputList((prev) => {
      const next = [...prev];
      for (let i = 0; i < rows.length; i++) {
        const targetIndex = rowIndex + i;
        if (targetIndex < next.length) {
          next[targetIndex] = {
            ...next[targetIndex],
            [field]: rows[i]
          };
        }
      }
      return next;
    });
  };

  const handleSubmitIjazah = async () => {
    if (ijazahInputList.length === 0) {
      alert("Impor kelas dan isi data terlebih dahulu.");
      return;
    }
    setSavingIjazah(true);
    try {
      const payload = ijazahInputList.map((item) => ({
        ...item,
        kelas: selectedClass,
      }));

      const res = await fetch("/api/data/kesiswaan/penyerahanIjazah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Gagal menyimpan data penyerahan ijazah.");
        return;
      }

      setOpenIjazah(false);
      setIjazahInputList([]);
      setSelectedClass("");
      await fetchIjazahRows();
    } catch (error) {
      console.error("Error saving ijazah rows:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setSavingIjazah(false);
    }
  };

  const handleEditIjazahRow = (item: IjazahRow) => {
    setEditingIjazahRow(item);
    setOpenEditIjazah(true);
  };

  const handleSubmitEditIjazahRow = async () => {
    if (!editingIjazahRow) return;
    setSavingIjazah(true);
    try {
      const updated = ijazahRows.map((item) =>
        item.id === editingIjazahRow.id ? editingIjazahRow : item
      );

      const res = await fetch("/api/data/kesiswaan/penyerahanIjazah?mode=overwrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        alert("Gagal memperbarui data penyerahan ijazah.");
        return;
      }

      setOpenEditIjazah(false);
      setEditingIjazahRow(null);
      await fetchIjazahRows();
    } catch (error) {
      console.error("Error updating ijazah row:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setSavingIjazah(false);
    }
  };

  const handleDeleteIjazah = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data penyerahan ijazah ini?")) return;
    try {
      const res = await fetch(`/api/data/kesiswaan/penyerahanIjazah?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchIjazahRows();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error deleting ijazah row:", error);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-semibold">Akademik & Kelulusan</CardTitle>
          <CardDescription>Buku catatan prestasi, kenaikan kelas, dan administrasi kelulusan.</CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) { setForm(EMPTY_FORM); setEditingPrestasiId(null); } }}>
            <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700 text-white" />}>
              <Plus className="h-4 w-4 mr-2" />
              Input Prestasi
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPrestasiId ? "Edit Prestasi Siswa" : "Input Prestasi Siswa"}</DialogTitle>
                <DialogDescription>Tambahkan atau ubah data prestasi di buku akademik.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="nama">Nama Siswa</Label>
                  <Input id="nama" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jenis">Jenis Prestasi / Lomba</Label>
                  <Input id="jenis" value={form.jenis} onChange={(e) => setForm((prev) => ({ ...prev, jenis: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tingkat">Tingkat</Label>
                  <Input id="tingkat" value={form.tingkat} onChange={(e) => setForm((prev) => ({ ...prev, tingkat: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="juara">Peringkat</Label>
                  <Input id="juara" value={form.juara} onChange={(e) => setForm((prev) => ({ ...prev, juara: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tahun">Tahun</Label>
                  <Input id="tahun" value={form.tahun} onChange={(e) => setForm((prev) => ({ ...prev, tahun: e.target.value }))} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setOpen(false); setForm(EMPTY_FORM); setEditingPrestasiId(null); }} disabled={saving}>Batal</Button>
                <Button onClick={handleSubmit} disabled={saving}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openKenaikan} onOpenChange={(val) => { setOpenKenaikan(val); if (!val) { setFormKenaikan(EMPTY_KENAIKAN_FORM); setEditingKenaikanId(null); } }}>
            <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-700 text-white" />}>
              <Plus className="h-4 w-4 mr-2" />
              Input Kenaikan Kelas
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingKenaikanId ? "Edit Kenaikan Kelas" : "Input Kenaikan Kelas"}</DialogTitle>
                <DialogDescription>Tambahkan atau ubah data kenaikan kelas.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="kelas">Kelas</Label>
                  <Input id="kelas" placeholder="Contoh: VII-A" value={formKenaikan.kelas} onChange={(e) => handleKenaikanChange("kelas", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="siswaNaik">Jumlah Siswa Naik</Label>
                  <Input id="siswaNaik" type="number" min="0" placeholder="0" value={formKenaikan.siswaNaik} onChange={(e) => handleKenaikanChange("siswaNaik", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="siswaTinggal">Jumlah Siswa Tinggal Kelas</Label>
                  <Input id="siswaTinggal" type="number" min="0" placeholder="0" value={formKenaikan.siswaTinggal} onChange={(e) => handleKenaikanChange("siswaTinggal", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jumlahSiswa">Jumlah Siswa (Total)</Label>
                  <Input id="jumlahSiswa" type="number" min="0" placeholder="0" value={formKenaikan.jumlahSiswa} onChange={(e) => handleKenaikanChange("jumlahSiswa", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prosentase">Prosentase Kenaikan (Otomatis)</Label>
                  <Input id="prosentase" disabled className="bg-slate-50 dark:bg-slate-800" value={formKenaikan.prosentase} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setOpenKenaikan(false); setFormKenaikan(EMPTY_KENAIKAN_FORM); setEditingKenaikanId(null); }} disabled={savingKenaikan}>Batal</Button>
                <Button onClick={handleSubmitKenaikan} disabled={savingKenaikan}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openRaport} onOpenChange={(val) => { setOpenRaport(val); if (!val) { setFormRaport(EMPTY_RAPORT_FORM); setEditingRaportId(null); } }}>
            <DialogTrigger render={<Button className="bg-amber-600 hover:bg-amber-700 text-white" />}>
              <Plus className="h-4 w-4 mr-2" />
              Input Penyerahan Raport
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRaportId ? "Edit Penyerahan Raport" : "Input Penyerahan Raport"}</DialogTitle>
                <DialogDescription>Tambahkan atau ubah rekapitulasi data penyerahan raport per kelas.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="raportKelas">Kelas</Label>
                  <Input id="raportKelas" placeholder="Contoh: VII-A" value={formRaport.kelas} onChange={(e) => handleRaportChange("kelas", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sudahDiserahkan">Jumlah Raport Sudah Diserahkan</Label>
                  <Input id="sudahDiserahkan" type="number" min="0" placeholder="0" value={formRaport.sudahDiserahkan} onChange={(e) => handleRaportChange("sudahDiserahkan", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="belumDiserahkan">Jumlah Raport Belum Diserahkan</Label>
                  <Input id="belumDiserahkan" type="number" min="0" placeholder="0" value={formRaport.belumDiserahkan} onChange={(e) => handleRaportChange("belumDiserahkan", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalRaport">Total Raport (Jumlah Siswa)</Label>
                  <Input id="totalRaport" disabled className="bg-slate-50 dark:bg-slate-800" value={formRaport.jumlahSiswa} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="raportProsentase">Prosentase Penyerahan (Otomatis)</Label>
                  <Input id="raportProsentase" disabled className="bg-slate-50 dark:bg-slate-800" value={formRaport.prosentase} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setOpenRaport(false); setFormRaport(EMPTY_RAPORT_FORM); setEditingRaportId(null); }} disabled={savingRaport}>Batal</Button>
                <Button onClick={handleSubmitRaport} disabled={savingRaport}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openIjazah} onOpenChange={setOpenIjazah}>
            <DialogTrigger render={<Button className="bg-teal-600 hover:bg-teal-700 text-white" />}>
              <Plus className="h-4 w-4 mr-2" />
              Input Penyerahan Ijazah
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Input Penyerahan Ijazah</DialogTitle>
                <DialogDescription>
                  Impor data siswa berdasarkan kelas lalu lengkapi Nomor Ijazah, Tanggal Penyerahan, dan Keterangan.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 py-2 flex-1 overflow-hidden">
                <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="grid gap-1.5 flex-1 max-w-xs">
                    <Label htmlFor="selectClassImport">Pilih Kelas</Label>
                    <select
                      id="selectClassImport"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="flex h-8 w-full rounded-lg border border-border bg-background px-3 py-1 text-sm shadow-2xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {uniqueClasses.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <Button variant="secondary" onClick={handleImportClassForIjazah} className="h-8">
                    Impor Data Siswa Kelas
                  </Button>
                </div>

                {ijazahInputList.length > 0 && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="mb-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                      💡 <strong>Tips Copas Excel:</strong> Anda dapat mencopas satu kolom data di Excel lalu menempelkannya (<strong>Ctrl + V</strong>) langsung ke salah satu kolom input di bawah untuk mengisi baris ke bawah secara otomatis.
                    </div>
                    
                    <div className="flex-1 overflow-y-auto border rounded-lg">
                      <Table>
                        <TableHeader className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                          <TableRow>
                            <TableHead className="w-10">No</TableHead>
                            <TableHead className="w-48">Nama</TableHead>
                            <TableHead className="w-24">NIS</TableHead>
                            <TableHead className="w-24">NISN</TableHead>
                            <TableHead>Nomor Ijazah</TableHead>
                            <TableHead>Tanggal Penyerahan</TableHead>
                            <TableHead>Keterangan</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ijazahInputList.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell className="font-medium text-slate-900 truncate max-w-[180px]">{item.nama}</TableCell>
                              <TableCell className="text-slate-500">{item.nis}</TableCell>
                              <TableCell className="text-slate-500">{item.nisn}</TableCell>
                              <TableCell>
                                <Input 
                                  value={item.noIjazah} 
                                  className="h-7 text-xs bg-white dark:bg-slate-900"
                                  placeholder="Copas / Ketik..."
                                  onChange={(e) => handleIjazahInputChange(idx, "noIjazah", e.target.value)} 
                                  onPaste={(e) => handleIjazahInputPaste(e, idx, "noIjazah")}
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  value={item.tanggalPenyerahan} 
                                  className="h-7 text-xs bg-white dark:bg-slate-900"
                                  placeholder="Contoh: 20 Juni 2026"
                                  onChange={(e) => handleIjazahInputChange(idx, "tanggalPenyerahan", e.target.value)} 
                                  onPaste={(e) => handleIjazahInputPaste(e, idx, "tanggalPenyerahan")}
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  value={item.keterangan} 
                                  className="h-7 text-xs bg-white dark:bg-slate-900"
                                  placeholder="Keterangan..."
                                  onChange={(e) => handleIjazahInputChange(idx, "keterangan", e.target.value)} 
                                  onPaste={(e) => handleIjazahInputPaste(e, idx, "keterangan")}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4 border-t pt-3">
                <Button variant="outline" onClick={() => { setOpenIjazah(false); setIjazahInputList([]); }} disabled={savingIjazah}>Batal</Button>
                <Button onClick={handleSubmitIjazah} disabled={savingIjazah || ijazahInputList.length === 0}>
                  {savingIjazah ? "Menyimpan..." : "Simpan Data"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion className="w-full" defaultValue={["prestasi", "kenaikan", "ujian", "raport", "ijazah"]}>
          <AccordionItem value="prestasi">
            <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
              1. Buku Prestasi Siswa
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead className="w-12.5">No</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Jenis Prestasi / Lomba</TableHead>
                      <TableHead>Tingkat</TableHead>
                      <TableHead>Peringkat</TableHead>
                      <TableHead>Tahun</TableHead>
                      <TableHead className="w-24 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                          Belum ada data prestasi.
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.nama}</TableCell>
                          <TableCell>{item.jenis}</TableCell>
                          <TableCell>{item.tingkat}</TableCell>
                          <TableCell className="text-emerald-600 font-medium">{item.juara}</TableCell>
                          <TableCell>{item.tahun}</TableCell>
                          <TableCell className="text-center flex justify-center gap-1">
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 h-8 w-8" onClick={() => handleEditPrestasi(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8" onClick={() => handleDeletePrestasi(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="kenaikan">
            <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
              2. Buku Kenaikan Kelas
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead className="w-12.5">No</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead className="text-center">Jumlah Siswa</TableHead>
                      <TableHead className="text-center">Siswa Naik</TableHead>
                      <TableHead className="text-center">Siswa Tinggal Kelas</TableHead>
                      <TableHead className="text-center">Prosentase Kenaikan</TableHead>
                      <TableHead className="w-24 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kenaikanRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                          Belum ada data kenaikan kelas.
                        </TableCell>
                      </TableRow>
                    ) : (
                      kenaikanRows.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.kelas}</TableCell>
                          <TableCell className="text-center">{item.jumlahSiswa}</TableCell>
                          <TableCell className="text-center text-emerald-600 font-medium">{item.siswaNaik}</TableCell>
                          <TableCell className="text-center text-red-600 font-medium">{item.siswaTinggal}</TableCell>
                          <TableCell className="text-center font-semibold text-blue-600 dark:text-blue-400">{item.prosentase}</TableCell>
                          <TableCell className="text-center flex justify-center gap-1">
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 h-8 w-8" onClick={() => handleEditKenaikan(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8" onClick={() => handleDeleteKenaikan(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ujian">
            <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
              3. Rekapitulasi Hasil TKA dan PSAJ
            </AccordionTrigger>
            <AccordionContent>
              {rekapLink ? (
                <div className="py-6 px-4 border rounded-md mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/40">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
                      <ExternalLink className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">Google Drive Hasil TKA & PSAJ</h4>
                      <p className="text-sm text-slate-500 truncate max-w-[280px] sm:max-w-md">{rekapLink}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={rekapLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50">
                        Buka Link
                      </Button>
                    </a>
                    <Button variant="outline" className="text-slate-600 dark:text-slate-400" onClick={() => setOpenRekap(true)}>
                      Ubah Link
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8" onClick={handleDeleteRekap}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 border rounded-md mt-2 border-dashed flex flex-col items-center justify-center gap-3">
                  <p>Belum ada link Google Drive untuk Rekapitulasi Hasil TKA dan PSAJ.</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpenRekap(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Input Link Google Drive
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="raport">
            <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
              4. Buku Penyerahan Raport
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead className="w-12.5">No</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead className="text-center">Total Raport (Siswa)</TableHead>
                      <TableHead className="text-center">Sudah Diserahkan</TableHead>
                      <TableHead className="text-center">Belum Diserahkan</TableHead>
                      <TableHead className="text-center">Prosentase Penyerahan</TableHead>
                      <TableHead className="w-24 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {raportRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                          Belum ada data penyerahan raport.
                        </TableCell>
                      </TableRow>
                    ) : (
                      raportRows.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.kelas}</TableCell>
                          <TableCell className="text-center">{item.jumlahSiswa}</TableCell>
                          <TableCell className="text-center text-emerald-600 font-medium">{item.sudahDiserahkan}</TableCell>
                          <TableCell className="text-center text-red-600 font-medium">{item.belumDiserahkan}</TableCell>
                          <TableCell className="text-center font-semibold text-blue-600 dark:text-blue-400">{item.prosentase}</TableCell>
                          <TableCell className="text-center flex justify-center gap-1">
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 h-8 w-8" onClick={() => handleEditRaport(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8" onClick={() => handleDeleteRaport(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ijazah">
            <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
              5. Buku Penyerahan Ijazah
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead className="w-12.5">No</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIS</TableHead>
                      <TableHead>NISN</TableHead>
                      <TableHead>Nomor Ijazah</TableHead>
                      <TableHead>Tanggal Penyerahan</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="w-24 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ijazahRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                          Belum ada data penyerahan ijazah.
                        </TableCell>
                      </TableRow>
                    ) : (
                      ijazahRows.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium text-slate-600">{item.kelas}</TableCell>
                          <TableCell className="font-semibold text-slate-900">{item.nama}</TableCell>
                          <TableCell className="text-slate-500">{item.nis || "-"}</TableCell>
                          <TableCell className="text-slate-500">{item.nisn || "-"}</TableCell>
                          <TableCell className="text-slate-800 font-medium">{item.noIjazah || "-"}</TableCell>
                          <TableCell className="text-slate-600">{item.tanggalPenyerahan || "-"}</TableCell>
                          <TableCell className="text-slate-500 text-xs italic">{item.keterangan || "-"}</TableCell>
                          <TableCell className="text-center flex justify-center gap-1">
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 h-8 w-8" onClick={() => handleEditIjazahRow(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8" onClick={() => handleDeleteIjazah(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      <Dialog open={openRekap} onOpenChange={setOpenRekap}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Input Link Google Drive</DialogTitle>
            <DialogDescription>Masukkan link Google Drive yang berisi Rekapitulasi Hasil TKA dan PSAJ.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="rekapLinkInput">Link Google Drive</Label>
              <Input 
                id="rekapLinkInput" 
                placeholder="https://drive.google.com/..." 
                value={inputLink} 
                onChange={(e) => setInputLink(e.target.value)} 
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRekap(false)} disabled={savingRekap}>Batal</Button>
            <Button onClick={handleSubmitRekap} disabled={savingRekap}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Single Ijazah Student Dialog */}
      <Dialog open={openEditIjazah} onOpenChange={(val) => { setOpenEditIjazah(val); if (!val) setEditingIjazahRow(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Penyerahan Ijazah</DialogTitle>
            <DialogDescription>
              Ubah rincian penyerahan ijazah untuk siswa <strong>{editingIjazahRow?.nama}</strong>.
            </DialogDescription>
          </DialogHeader>

          {editingIjazahRow && (
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <span className="text-xs font-semibold text-slate-500">Nama Siswa</span>
                <span className="text-sm font-medium text-slate-900">{editingIjazahRow.nama}</span>
              </div>
              <div className="grid gap-1">
                <span className="text-xs font-semibold text-slate-500">NIS / NISN</span>
                <span className="text-sm text-slate-700">{editingIjazahRow.nis || "-"} / {editingIjazahRow.nisn || "-"}</span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editNoIjazah">Nomor Ijazah</Label>
                <Input
                  id="editNoIjazah"
                  value={editingIjazahRow.noIjazah}
                  onChange={(e) => setEditingIjazahRow(prev => prev ? { ...prev, noIjazah: e.target.value } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editTglIjazah">Tanggal Penyerahan</Label>
                <Input
                  id="editTglIjazah"
                  value={editingIjazahRow.tanggalPenyerahan}
                  onChange={(e) => setEditingIjazahRow(prev => prev ? { ...prev, tanggalPenyerahan: e.target.value } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editKetIjazah">Keterangan</Label>
                <Input
                  id="editKetIjazah"
                  value={editingIjazahRow.keterangan}
                  onChange={(e) => setEditingIjazahRow(prev => prev ? { ...prev, keterangan: e.target.value } : null)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpenEditIjazah(false); setEditingIjazahRow(null); }} disabled={savingIjazah}>Batal</Button>
            <Button onClick={handleSubmitEditIjazahRow} disabled={savingIjazah}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
