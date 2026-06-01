"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import Image from "next/image";
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
  BadgeInfo,
  Camera
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getIdentitas, updateIdentitas } from "@/lib/clientDb";

const INITIAL_STATE = {
  fotoKepalaSekolah: "",
  logoSekolah: "",
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
  const { headmasterData } = useAuth();
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setForm((prev) => ({ ...prev, fotoKepalaSekolah: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setForm((prev) => ({ ...prev, logoSekolah: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchIdentitas = () => {
      try {
        const data = getIdentitas();
        setForm(data || INITIAL_STATE);
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
      updateIdentitas(form);
      setForm(form);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
    <div className="flex-1 overflow-y-auto bg-linear-to-tr from-slate-50 via-slate-100/50 to-indigo-50/30 relative">
      {/* Premium Ambient Background Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-200/30 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-purple-200/20 blur-[160px] pointer-events-none" />

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-lg border border-emerald-500/20"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-100">Data identitas sekolah telah diperbarui.</p>
          </div>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
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
            
            {/* Left Column: Headmaster Profile & Logo Cards */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 self-start">
              {/* Logo Sekolah Card */}
              <Card className="overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
                <CardHeader className="text-center pb-4">
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="mx-auto w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-200/60 shadow-inner relative overflow-hidden group cursor-pointer"
                  >
                    {form.logoSekolah ? (
                      <Image src={form.logoSekolah} alt="Logo Sekolah" fill className="object-contain p-2" />
                    ) : (
                      <School className="w-12 h-12 text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleLogoUpload} />
                  <CardTitle className="text-lg">Logo Sekolah</CardTitle>
                  <CardDescription>Logo resmi instansi sekolah</CardDescription>
                </CardHeader>
              </Card>

              {/* Headmaster Profile Card */}
              <Card className="overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardHeader className="text-center pb-2">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="mx-auto w-24 h-24 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100 shadow-inner relative overflow-hidden group cursor-pointer"
                  >
                    {form.fotoKepalaSekolah ? (
                      <Image src={form.fotoKepalaSekolah} alt="Foto Kepala Sekolah" fill className="object-cover" />
                    ) : (
                      <UserCircle className="w-12 h-12" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
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
                        value={headmasterData?.nama || form.namaKepalaSekolah}
                        onChange={(e) => handleInputChange("namaKepalaSekolah", e.target.value)}
                        disabled={true}
                        className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed opacity-100"
                        title="Dikunci dari akun login"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nipKepalaSekolah">NIP Kepala Sekolah</Label>
                    <Input
                      id="nipKepalaSekolah"
                      placeholder="Masukkan NIP (jika ada)"
                      value={headmasterData?.nip || form.nipKepalaSekolah}
                      onChange={(e) => handleInputChange("nipKepalaSekolah", e.target.value)}
                      disabled={true}
                      className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed opacity-100"
                      title="Dikunci dari akun login"
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
              <Card>
                <CardHeader className="border-b border-slate-100/80 pb-4 flex flex-row items-center gap-3">
                  <div className="p-2.5 bg-indigo-50/80 backdrop-blur-xs text-indigo-600 rounded-xl border border-indigo-100/50">
                    <School className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">Profil & Identitas Sekolah</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Detail kelembagaan dan informasi operasional sekolah</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="namaSekolah" className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Building className="w-4 h-4 text-slate-400 shrink-0" />
                      Nama Sekolah
                    </Label>
                    <Input
                      id="namaSekolah"
                      placeholder="Masukkan nama resmi sekolah"
                      value={form.namaSekolah}
                      onChange={(e) => handleInputChange("namaSekolah", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors text-base font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="npsn" className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                      NPSN (Nomor Pokok Sekolah Nasional)
                    </Label>
                    <Input
                      id="npsn"
                      placeholder="Contoh: 20302302"
                      value={form.npsn}
                      onChange={(e) => handleInputChange("npsn", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kodePos" className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      Kode Pos
                    </Label>
                    <Input
                      id="kodePos"
                      placeholder="Contoh: 50774"
                      value={form.kodePos}
                      onChange={(e) => handleInputChange("kodePos", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="alamat" className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      Alamat Jalan / Lokasi
                    </Label>
                    <Input
                      id="alamat"
                      placeholder="Nama jalan, nomor, RT/RW"
                      value={form.alamat}
                      onChange={(e) => handleInputChange("alamat", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kelurahan" className="text-xs font-bold text-slate-700">Kelurahan / Desa</Label>
                    <Input
                      id="kelurahan"
                      placeholder="Nama Kelurahan atau Desa"
                      value={form.kelurahan}
                      onChange={(e) => handleInputChange("kelurahan", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kecamatan" className="text-xs font-bold text-slate-700">Kecamatan</Label>
                    <Input
                      id="kecamatan"
                      placeholder="Nama Kecamatan"
                      value={form.kecamatan}
                      onChange={(e) => handleInputChange("kecamatan", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kabupaten" className="text-xs font-bold text-slate-700">Kabupaten / Kota</Label>
                    <Input
                      id="kabupaten"
                      placeholder="Nama Kabupaten atau Kota"
                      value={form.kabupaten}
                      onChange={(e) => handleInputChange("kabupaten", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provinsi" className="text-xs font-bold text-slate-700">Provinsi</Label>
                    <Input
                      id="provinsi"
                      placeholder="Nama Provinsi"
                      value={form.provinsi}
                      onChange={(e) => handleInputChange("provinsi", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2 border-t border-slate-200/60 pt-4 mt-2">
                    <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">Informasi Kontak & Media</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telepon" className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      Nomor Telepon
                    </Label>
                    <Input
                      id="telepon"
                      placeholder="Telepon sekolah / Fax"
                      value={form.telepon}
                      onChange={(e) => handleInputChange("telepon", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      Email Sekolah
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sekolah@kemdikbud.go.id"
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website" className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      placeholder="https://www.sekolahanda.sch.id"
                      value={form.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="bg-white/50 border-slate-200/60 text-slate-800 placeholder:text-slate-400 focus-visible:bg-white transition-colors"
                    />
                  </div>

                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border border-white/50 bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-6 py-2.5 h-11 shadow-md hover:shadow-indigo-500/10 shrink-0 flex items-center gap-2 rounded-xl cursor-pointer active:scale-98 transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-white" />
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
