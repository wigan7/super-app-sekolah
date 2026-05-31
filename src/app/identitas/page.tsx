"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  School, 
  UserCircle, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Hash, 
  FileText,
  BadgeInfo
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const INITIAL_STATE = {
  namaKepalaSekolah: "",
  nipKepalaSekolah: "",
  jabatanKepalaSekolah: "",
  golonganKepalaSekolah: "",
  namaSekolah: "",
  npsn: "",
  alamat: "",
  kelurahan: "",
  kecamatan: "",
  kabupaten: "",
  provinsi: "",
  kodePos: "",
  telepon: "",
  email: "",
  website: "",
};

export default function IdentitasPage() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchIdentitas = async () => {
      try {
        const res = await fetch("/api/identitas");
        if (res.ok) {
          const data = await res.json();
          setForm(data || INITIAL_STATE);
        }
      } catch (error) {
        console.error("Gagal memuat identitas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdentitas();
  }, []);

  const handleInputChange = (field: keyof typeof INITIAL_STATE, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/identitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setForm(data);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert("Gagal menyimpan data identitas.");
      }
    } catch (error) {
      console.error("Gagal menyimpan identitas:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Memuat data identitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-lg border border-emerald-500/20"
        >
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-100">Data identitas sekolah telah diperbarui.</p>
          </div>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Identitas Sekolah & Kepala Sekolah</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola data pokok sekolah dan kepala sekolah untuk integrasi otomatis di dokumen, laporan, dan menu lainnya.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-indigo-50 text-indigo-700 px-3.5 py-2 rounded-lg border border-indigo-100 font-medium">
            <BadgeInfo className="w-4 h-4 shrink-0" />
            <span>Semua input bersifat opsional</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Headmaster Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-slate-200/60 shadow-sm overflow-hidden bg-white sticky top-8">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100 shadow-inner">
                    <UserCircle className="w-12 h-12" />
                  </div>
                  <CardTitle className="text-lg">Kepala Sekolah</CardTitle>
                  <CardDescription>Profil penanggung jawab sekolah</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaKepalaSekolah">Nama Lengkap</Label>
                    <div className="relative">
                      <Input
                        id="namaKepalaSekolah"
                        placeholder="Nama Kepala Sekolah beserta gelar"
                        value={form.namaKepalaSekolah}
                        onChange={(e) => handleInputChange("namaKepalaSekolah", e.target.value)}
                        className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nipKepalaSekolah">NIP Kepala Sekolah</Label>
                    <Input
                      id="nipKepalaSekolah"
                      placeholder="Masukkan NIP (jika ada)"
                      value={form.nipKepalaSekolah}
                      onChange={(e) => handleInputChange("nipKepalaSekolah", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jabatanKepalaSekolah">Jabatan</Label>
                    <Input
                      id="jabatanKepalaSekolah"
                      placeholder="Contoh: Kepala Sekolah / PLT"
                      value={form.jabatanKepalaSekolah}
                      onChange={(e) => handleInputChange("jabatanKepalaSekolah", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="golonganKepalaSekolah">Golongan / Ruang</Label>
                    <Input
                      id="golonganKepalaSekolah"
                      placeholder="Contoh: Pembina Tk. I, IV/b"
                      value={form.golonganKepalaSekolah}
                      onChange={(e) => handleInputChange("golonganKepalaSekolah", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: School details Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200/60 shadow-sm bg-white">
                <CardHeader className="border-b border-slate-100/80 pb-4 flex flex-row items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Profil & Identitas Sekolah</CardTitle>
                    <CardDescription>Detail kelembagaan dan informasi operasional sekolah</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="namaSekolah" className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      Nama Sekolah
                    </Label>
                    <Input
                      id="namaSekolah"
                      placeholder="Masukkan nama resmi sekolah"
                      value={form.namaSekolah}
                      onChange={(e) => handleInputChange("namaSekolah", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors text-base font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="npsn" className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-slate-400" />
                      NPSN (Nomor Pokok Sekolah Nasional)
                    </Label>
                    <Input
                      id="npsn"
                      placeholder="Contoh: 20302302"
                      value={form.npsn}
                      onChange={(e) => handleInputChange("npsn", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kodePos" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Kode Pos
                    </Label>
                    <Input
                      id="kodePos"
                      placeholder="Contoh: 50774"
                      value={form.kodePos}
                      onChange={(e) => handleInputChange("kodePos", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="alamat" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Alamat Jalan / Lokasi
                    </Label>
                    <Input
                      id="alamat"
                      placeholder="Nama jalan, nomor, RT/RW"
                      value={form.alamat}
                      onChange={(e) => handleInputChange("alamat", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kelurahan">Kelurahan / Desa</Label>
                    <Input
                      id="kelurahan"
                      placeholder="Nama Kelurahan atau Desa"
                      value={form.kelurahan}
                      onChange={(e) => handleInputChange("kelurahan", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kecamatan">Kecamatan</Label>
                    <Input
                      id="kecamatan"
                      placeholder="Nama Kecamatan"
                      value={form.kecamatan}
                      onChange={(e) => handleInputChange("kecamatan", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kabupaten">Kabupaten / Kota</Label>
                    <Input
                      id="kabupaten"
                      placeholder="Nama Kabupaten atau Kota"
                      value={form.kabupaten}
                      onChange={(e) => handleInputChange("kabupaten", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provinsi">Provinsi</Label>
                    <Input
                      id="provinsi"
                      placeholder="Nama Provinsi"
                      value={form.provinsi}
                      onChange={(e) => handleInputChange("provinsi", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">Informasi Kontak & Media</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telepon" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      Nomor Telepon
                    </Label>
                    <Input
                      id="telepon"
                      placeholder="Telepon sekolah / Fax"
                      value={form.telepon}
                      onChange={(e) => handleInputChange("telepon", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      Email Sekolah
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sekolah@kemdikbud.go.id"
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      placeholder="https://www.sekolahanda.sch.id"
                      value={form.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="bg-slate-50/30 focus-visible:bg-white transition-colors"
                    />
                  </div>

                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold px-6 py-2 h-11 shadow-sm shrink-0 flex items-center gap-2 rounded-lg cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </Button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
