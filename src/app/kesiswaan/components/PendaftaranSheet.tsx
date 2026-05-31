"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";

export default function PendaftaranSheet({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nisn: "",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    nama_ayah: "",
    pekerjaan_ayah: "",
    nama_ibu: "",
    pekerjaan_ibu: "",
    no_hp: "",
    masuk_kelas: "",
    asal_tk: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kesiswaan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        alert("Gagal menambahkan siswa.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700 text-white active:scale-97 transition-transform cursor-pointer" />}>
        <Plus className="mr-2 h-4 w-4" />
        Pendaftaran Siswa Baru
      </DialogTrigger>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl dark:bg-slate-950/95 dark:border-slate-800/50">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-slate-900">Pendaftaran Siswa Baru</DialogTitle>
          <DialogDescription className="text-slate-500 mt-1">
            Masukkan data siswa baru. Form ini akan masuk ke Buku Induk.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card 1: Keterangan Murid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">A. Keterangan Murid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                <Input id="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} placeholder="Masukkan nama lengkap siswa" className="bg-white/50" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nisn">NISN</Label>
                  <Input id="nisn" value={formData.nisn} onChange={handleChange} placeholder="Nomor Induk Siswa Nasional" className="bg-white/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK</Label>
                  <Input id="nik" value={formData.nik} onChange={handleChange} placeholder="Nomor Induk Kependudukan" className="bg-white/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                  <Input id="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} placeholder="Kota kelahiran" className="bg-white/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                  <Input id="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} type="date" className="bg-white/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Input id="alamat" value={formData.alamat} onChange={handleChange} placeholder="Jalan, RT/RW, Desa/Kelurahan" className="bg-white/50" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Orangtua/Wali */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">B. Orangtua / Wali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama_ayah">Nama Ayah</Label>
                  <Input id="nama_ayah" value={formData.nama_ayah} onChange={handleChange} placeholder="Nama ayah kandung" className="bg-white/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
                  <Input id="pekerjaan_ayah" value={formData.pekerjaan_ayah} onChange={handleChange} placeholder="Pekerjaan" className="bg-white/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama_ibu">Nama Ibu</Label>
                  <Input id="nama_ibu" value={formData.nama_ibu} onChange={handleChange} placeholder="Nama ibu kandung" className="bg-white/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
                  <Input id="pekerjaan_ibu" value={formData.pekerjaan_ibu} onChange={handleChange} placeholder="Pekerjaan" className="bg-white/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="no_hp">No. HP / WhatsApp Wali</Label>
                <Input id="no_hp" value={formData.no_hp} onChange={handleChange} placeholder="Contoh: 081234567890" className="bg-white/50" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Asal Mula Anak */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">C. Asal Mula Anak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="masuk_kelas">Masuk di Sekolah ini sebagai Kelas</Label>
                <Input id="masuk_kelas" value={formData.masuk_kelas} onChange={handleChange} placeholder="Contoh: I (Satu)" className="bg-white/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asal_tk">Asal TK / PAUD (Jika ada)</Label>
                <Input id="asal_tk" value={formData.asal_tk} onChange={handleChange} placeholder="Nama TK asal" className="bg-white/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/50 backdrop-blur-xs flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="active:scale-97 transition-transform">Batal</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white active:scale-97 transition-transform cursor-pointer" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Simpan Data Siswa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
