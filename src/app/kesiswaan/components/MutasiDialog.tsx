"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileOutput } from "lucide-react";

const INITIAL_FORM = {
  jenis: "masuk",
  tanggal: "",
  nama: "",
  sekolah: "",
  kelas: "",
  keterangan: "",
};

export default function MutasiDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const endpoint = form.jenis === "masuk" ? "/api/data/kesiswaan/mutasiMasuk" : "/api/data/kesiswaan/mutasiKeluar";
      const payload = {
        tanggal: form.tanggal,
        nama: form.nama,
        kelas: form.kelas,
        keterangan: form.keterangan,
        ...(form.jenis === "masuk" ? { dari: form.sekolah } : { ke: form.sekolah }),
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Gagal menyimpan data mutasi.");
        return;
      }

      setForm(INITIAL_FORM);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Gagal menyimpan mutasi:", error);
      alert("Terjadi kesalahan saat menyimpan mutasi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950" />}>
        <FileOutput className="mr-2 h-4 w-4" />
        Input Mutasi
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Input Data Mutasi</DialogTitle>
          <DialogDescription>
            Masukkan detail mutasi siswa masuk atau keluar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="jenis_mutasi">Jenis Mutasi</Label>
            <select
              id="jenis_mutasi"
              value={form.jenis}
              onChange={(e) => setForm((prev) => ({ ...prev, jenis: e.target.value }))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="masuk">Masuk</option>
              <option value="keluar">Keluar / Pindah</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal_mutasi">Tanggal</Label>
            <Input id="tanggal_mutasi" value={form.tanggal} onChange={(e) => setForm((prev) => ({ ...prev, tanggal: e.target.value }))} placeholder="Contoh: 15 Jul 2026" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nama_siswa">Nama Siswa</Label>
            <Input id="nama_siswa" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} placeholder="Nama siswa" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sekolah">{form.jenis === "masuk" ? "Sekolah Asal" : "Sekolah Tujuan"}</Label>
            <Input id="sekolah" value={form.sekolah} onChange={(e) => setForm((prev) => ({ ...prev, sekolah: e.target.value }))} placeholder="Nama sekolah" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kelas">Kelas</Label>
            <Input id="kelas" value={form.kelas} onChange={(e) => setForm((prev) => ({ ...prev, kelas: e.target.value }))} placeholder="Contoh: 4A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Input id="keterangan" value={form.keterangan} onChange={(e) => setForm((prev) => ({ ...prev, keterangan: e.target.value }))} placeholder="Alasan mutasi" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Batal</Button>
          <Button type="button" onClick={handleSubmit} disabled={saving}>Simpan Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
