"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type DiklatRow = {
  id: string;
  nama: string;
  diklat: string;
  penyelenggara: string;
  tingkat: string;
  tahun: string;
  lama: string;
};

type PenghargaanRow = {
  id: string;
  nama: string;
  penghargaan: string;
  tingkat: string;
  instansi: string;
  nomor: string;
  tahun: string;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_DIKLAT = {
  nama: "",
  diklat: "",
  penyelenggara: "",
  tingkat: "",
  tahun: "",
  lama: "",
};

const EMPTY_PENGHARGAAN = {
  nama: "",
  penghargaan: "",
  tingkat: "",
  instansi: "",
  nomor: "",
  tahun: "",
};

export function PengembanganPrestasiTab() {
  const [diklatRows, setDiklatRows] = useState<DiklatRow[]>([]);
  const [penghargaanRows, setPenghargaanRows] = useState<PenghargaanRow[]>([]);
  const [openDiklat, setOpenDiklat] = useState(false);
  const [openPenghargaan, setOpenPenghargaan] = useState(false);
  const [diklatForm, setDiklatForm] = useState(EMPTY_DIKLAT);
  const [penghargaanForm, setPenghargaanForm] = useState(EMPTY_PENGHARGAAN);

  const fetchRows = async () => {
    try {
      const [diklatRes, penghargaanRes] = await Promise.all([
        fetch("/api/data/kepegawaian/diklat"),
        fetch("/api/data/kepegawaian/penghargaan"),
      ]);

      if (diklatRes.ok) {
        const data = await diklatRes.json();
        setDiklatRows(Array.isArray(data) ? data : []);
      }

      if (penghargaanRes.ok) {
        const data = await penghargaanRes.json();
        setPenghargaanRows(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat data pengembangan/prestasi:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const saveDiklat = async () => {
    const res = await fetch("/api/data/kepegawaian/diklat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diklatForm),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan diklat");
    }

    setDiklatForm(EMPTY_DIKLAT);
    setOpenDiklat(false);
    await fetchRows();
  };

  const savePenghargaan = async () => {
    const res = await fetch("/api/data/kepegawaian/penghargaan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(penghargaanForm),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan penghargaan");
    }

    setPenghargaanForm(EMPTY_PENGHARGAAN);
    setOpenPenghargaan(false);
    await fetchRows();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out pb-12">
      <div className="flex flex-col gap-1 px-4 lg:px-0 pt-4">
        <h2 className="text-[34px] font-bold tracking-tight text-slate-900 leading-tight">
          Pengembangan & Prestasi
        </h2>
        <p className="text-[15px] text-slate-500">
          Kelola riwayat diklat, penataran, seminar, dan penghargaan.
        </p>
      </div>

      {/* Diklat Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-4 lg:px-2">
          <h3 className="text-[13px] uppercase tracking-wide text-slate-500 font-medium">
            Diklat & Seminar
          </h3>
          <Dialog open={openDiklat} onOpenChange={setOpenDiklat}>
            <DialogTrigger render={<button className="text-primary text-[15px] font-medium active:opacity-60 transition-opacity" />}>
              Tambah
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] rounded-[32px] ios-glass p-0 border-0 shadow-2xl overflow-hidden">
              <DialogHeader className="px-4 py-4 border-b border-slate-200/60 bg-white/50 text-center">
                <DialogTitle className="text-[17px] font-semibold tracking-tight text-slate-900 text-center w-full">Input Diklat/Seminar</DialogTitle>
                <DialogDescription className="hidden">Simpan riwayat pengembangan</DialogDescription>
              </DialogHeader>
              <div className="bg-background/50 p-4">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200/60">
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="dnama" className="w-1/3 text-[15px] text-slate-900 font-normal">Nama</Label>
                    <Input id="dnama" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Masukkan nama" value={diklatForm.nama} onChange={(e) => setDiklatForm((prev) => ({ ...prev, nama: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="ddiklat" className="w-1/3 text-[15px] text-slate-900 font-normal">Diklat</Label>
                    <Input id="ddiklat" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Nama diklat" value={diklatForm.diklat} onChange={(e) => setDiklatForm((prev) => ({ ...prev, diklat: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="dpenyelenggara" className="w-1/3 text-[15px] text-slate-900 font-normal">Penyelenggara</Label>
                    <Input id="dpenyelenggara" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Instansi" value={diklatForm.penyelenggara} onChange={(e) => setDiklatForm((prev) => ({ ...prev, penyelenggara: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="dtingkat" className="w-1/3 text-[15px] text-slate-900 font-normal">Tingkat</Label>
                    <Input id="dtingkat" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Nasional" value={diklatForm.tingkat} onChange={(e) => setDiklatForm((prev) => ({ ...prev, tingkat: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="dtahun" className="w-1/3 text-[15px] text-slate-900 font-normal">Tahun</Label>
                    <Input id="dtahun" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Tahun" value={diklatForm.tahun} onChange={(e) => setDiklatForm((prev) => ({ ...prev, tahun: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <Label htmlFor="dlama" className="w-1/3 text-[15px] text-slate-900 font-normal">Lama (Jam)</Label>
                    <Input id="dlama" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Total JP" value={diklatForm.lama} onChange={(e) => setDiklatForm((prev) => ({ ...prev, lama: e.target.value }))} />
                  </div>
                </div>
              </div>
              <DialogFooter className="px-4 py-3 border-t border-slate-200/60 bg-white/50 flex flex-row gap-2 sm:justify-between">
                <Button variant="ghost" className="flex-1 rounded-xl text-slate-900 text-[15px] hover:bg-slate-200/50" onClick={() => setOpenDiklat(false)}>Batal</Button>
                <Button className="flex-1 rounded-xl bg-primary text-white text-[15px] font-semibold hover:bg-primary/90" onClick={saveDiklat}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mx-0 lg:mx-0 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm squircle-lg">
          {diklatRows.length === 0 ? (
            <div className="p-8 text-center text-[15px] text-slate-500">Belum ada data diklat.</div>
          ) : (
            <div className="flex flex-col">
              {diklatRows.map((item, index) => (
                <div key={item.id} className="group flex flex-col relative">
                  <div className="flex items-start justify-between p-4 bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col gap-1 pr-4 min-w-0">
                      <span className="text-[17px] font-medium text-slate-900 truncate">{item.diklat}</span>
                      <span className="text-[15px] text-slate-500 truncate">{item.nama} • {item.penyelenggara}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[15px] text-slate-500">{item.tahun}</span>
                      <span className="text-[13px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.lama} Jam</span>
                    </div>
                  </div>
                  {/* iOS Style Separator */}
                  {index !== diklatRows.length - 1 && (
                    <div className="h-[1px] bg-slate-200/60 ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Penghargaan Section */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center justify-between px-4 lg:px-2">
          <h3 className="text-[13px] uppercase tracking-wide text-slate-500 font-medium">
            Penghargaan
          </h3>
          <Dialog open={openPenghargaan} onOpenChange={setOpenPenghargaan}>
            <DialogTrigger render={<button className="text-primary text-[15px] font-medium active:opacity-60 transition-opacity" />}>
              Tambah
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] rounded-[32px] ios-glass p-0 border-0 shadow-2xl overflow-hidden">
              <DialogHeader className="px-4 py-4 border-b border-slate-200/60 bg-white/50 text-center">
                <DialogTitle className="text-[17px] font-semibold tracking-tight text-slate-900 text-center w-full">Input Penghargaan</DialogTitle>
                <DialogDescription className="hidden">Simpan data penghargaan</DialogDescription>
              </DialogHeader>
              <div className="bg-background/50 p-4">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200/60">
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="pnama" className="w-1/3 text-[15px] text-slate-900 font-normal">Nama</Label>
                    <Input id="pnama" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Masukkan nama" value={penghargaanForm.nama} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, nama: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="ppenghargaan" className="w-1/3 text-[15px] text-slate-900 font-normal">Penghargaan</Label>
                    <Input id="ppenghargaan" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Nama penghargaan" value={penghargaanForm.penghargaan} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, penghargaan: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="pinstansi" className="w-1/3 text-[15px] text-slate-900 font-normal">Instansi</Label>
                    <Input id="pinstansi" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Pemberi penghargaan" value={penghargaanForm.instansi} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, instansi: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="ptingkat" className="w-1/3 text-[15px] text-slate-900 font-normal">Tingkat</Label>
                    <Input id="ptingkat" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Nasional" value={penghargaanForm.tingkat} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, tingkat: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3 border-b border-slate-200/60 ml-4 pl-0">
                    <Label htmlFor="pnomor" className="w-1/3 text-[15px] text-slate-900 font-normal">Nomor</Label>
                    <Input id="pnomor" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Nomor SK" value={penghargaanForm.nomor} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, nomor: e.target.value }))} />
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <Label htmlFor="ptahun" className="w-1/3 text-[15px] text-slate-900 font-normal">Tahun</Label>
                    <Input id="ptahun" className="w-2/3 border-0 bg-transparent p-0 text-[15px] text-right focus-visible:ring-0 shadow-none rounded-none h-auto" placeholder="Tahun perolehan" value={penghargaanForm.tahun} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, tahun: e.target.value }))} />
                  </div>
                </div>
              </div>
              <DialogFooter className="px-4 py-3 border-t border-slate-200/60 bg-white/50 flex flex-row gap-2 sm:justify-between">
                <Button variant="ghost" className="flex-1 rounded-xl text-slate-900 text-[15px] hover:bg-slate-200/50" onClick={() => setOpenPenghargaan(false)}>Batal</Button>
                <Button className="flex-1 rounded-xl bg-primary text-white text-[15px] font-semibold hover:bg-primary/90" onClick={savePenghargaan}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mx-0 lg:mx-0 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm squircle-lg">
          {penghargaanRows.length === 0 ? (
            <div className="p-8 text-center text-[15px] text-slate-500">Belum ada data penghargaan.</div>
          ) : (
            <div className="flex flex-col">
              {penghargaanRows.map((item, index) => (
                <div key={item.id} className="group flex flex-col relative">
                  <div className="flex items-start justify-between p-4 bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col gap-1 pr-4 min-w-0">
                      <span className="text-[17px] font-medium text-slate-900 truncate">{item.penghargaan}</span>
                      <span className="text-[15px] text-slate-500 truncate">{item.nama} • {item.instansi}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[15px] text-slate-500">{item.tahun}</span>
                      <span className="text-[13px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.tingkat}</span>
                    </div>
                  </div>
                  {/* iOS Style Separator */}
                  {index !== penghargaanRows.length - 1 && (
                    <div className="h-[1px] bg-slate-200/60 ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
