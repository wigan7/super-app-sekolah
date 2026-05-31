"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type HarianRow = {
  id: string;
  kelas: string;
  sakit: number;
  izin: number;
  alpa: number;
  total_siswa: number;
  keterangan: string;
};

type BulananRow = {
  id: string;
  bulan: string;
  sakit: number;
  izin: number;
  alpa: number;
  efektif: number;
};

const EMPTY_HARIAN = {
  kelas: "",
  total_siswa: "",
  sakit: "",
  izin: "",
  alpa: "",
  keterangan: "",
};

const EMPTY_BULANAN = {
  bulan: "",
  sakit: "",
  izin: "",
  alpa: "",
  efektif: "",
};

export default function TabKehadiran() {
  const [isBulanan, setIsBulanan] = useState(false);
  const [harianRows, setHarianRows] = useState<HarianRow[]>([]);
  const [bulananRows, setBulananRows] = useState<BulananRow[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [harianForm, setHarianForm] = useState(EMPTY_HARIAN);
  const [bulananForm, setBulananForm] = useState(EMPTY_BULANAN);

  const fetchRows = async () => {
    try {
      const [harianRes, bulananRes] = await Promise.all([
        fetch("/api/data/kesiswaan/kehadiranHarian"),
        fetch("/api/data/kesiswaan/kehadiranBulanan"),
      ]);

      if (harianRes.ok) {
        const harianData = await harianRes.json();
        setHarianRows(Array.isArray(harianData) ? harianData : []);
      }

      if (bulananRes.ok) {
        const bulananData = await bulananRes.json();
        setBulananRows(Array.isArray(bulananData) ? bulananData : []);
      }
    } catch (error) {
      console.error("Gagal memuat data kehadiran:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const submitHarian = async () => {
    const payload = {
      kelas: harianForm.kelas,
      total_siswa: Number(harianForm.total_siswa || 0),
      sakit: Number(harianForm.sakit || 0),
      izin: Number(harianForm.izin || 0),
      alpa: Number(harianForm.alpa || 0),
      keterangan: harianForm.keterangan,
    };

    const res = await fetch("/api/data/kesiswaan/kehadiranHarian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan kehadiran harian");
    }

    setHarianForm(EMPTY_HARIAN);
  };

  const submitBulanan = async () => {
    const payload = {
      bulan: bulananForm.bulan,
      sakit: Number(bulananForm.sakit || 0),
      izin: Number(bulananForm.izin || 0),
      alpa: Number(bulananForm.alpa || 0),
      efektif: Number(bulananForm.efektif || 0),
    };

    const res = await fetch("/api/data/kesiswaan/kehadiranBulanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan kehadiran bulanan");
    }

    setBulananForm(EMPTY_BULANAN);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isBulanan) {
        await submitBulanan();
      } else {
        await submitHarian();
      }
      setOpen(false);
      await fetchRows();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data kehadiran.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Papan Absen</CardTitle>
          <CardDescription>
            {isBulanan ? "Rekapitulasi kehadiran bulanan siswa." : "Pantauan kehadiran harian siswa per kelas."}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="view-mode" className="text-sm font-medium text-slate-500">
              Harian
            </Label>
            <Switch
              id="view-mode"
              checked={isBulanan}
              onCheckedChange={setIsBulanan}
            />
            <Label htmlFor="view-mode" className="text-sm font-medium text-slate-900 dark:text-slate-200">
              Bulanan
            </Label>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700 text-white" />}>
              <Plus className="h-4 w-4 mr-2" />
              Input Data
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isBulanan ? "Input Kehadiran Bulanan" : "Input Kehadiran Harian"}</DialogTitle>
                <DialogDescription>Simpan data kehadiran baru.</DialogDescription>
              </DialogHeader>

              {!isBulanan ? (
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="kelas">Kelas</Label>
                    <Input id="kelas" value={harianForm.kelas} onChange={(e) => setHarianForm((prev) => ({ ...prev, kelas: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="total_siswa">Total Siswa</Label>
                      <Input id="total_siswa" type="number" value={harianForm.total_siswa} onChange={(e) => setHarianForm((prev) => ({ ...prev, total_siswa: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="keterangan">Keterangan</Label>
                      <Input id="keterangan" value={harianForm.keterangan} onChange={(e) => setHarianForm((prev) => ({ ...prev, keterangan: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="sakit">Sakit</Label>
                      <Input id="sakit" type="number" value={harianForm.sakit} onChange={(e) => setHarianForm((prev) => ({ ...prev, sakit: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="izin">Izin</Label>
                      <Input id="izin" type="number" value={harianForm.izin} onChange={(e) => setHarianForm((prev) => ({ ...prev, izin: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="alpa">Alpa</Label>
                      <Input id="alpa" type="number" value={harianForm.alpa} onChange={(e) => setHarianForm((prev) => ({ ...prev, alpa: e.target.value }))} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="bulan">Bulan</Label>
                    <Input id="bulan" value={bulananForm.bulan} onChange={(e) => setBulananForm((prev) => ({ ...prev, bulan: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="bsakit">Sakit</Label>
                      <Input id="bsakit" type="number" value={bulananForm.sakit} onChange={(e) => setBulananForm((prev) => ({ ...prev, sakit: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bizin">Izin</Label>
                      <Input id="bizin" type="number" value={bulananForm.izin} onChange={(e) => setBulananForm((prev) => ({ ...prev, izin: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="balpa">Alpa</Label>
                      <Input id="balpa" type="number" value={bulananForm.alpa} onChange={(e) => setBulananForm((prev) => ({ ...prev, alpa: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="efektif">Hari Efektif</Label>
                    <Input id="efektif" type="number" value={bulananForm.efektif} onChange={(e) => setBulananForm((prev) => ({ ...prev, efektif: e.target.value }))} />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Batal</Button>
                <Button onClick={handleSave} disabled={saving}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              {isBulanan ? (
                <TableRow>
                  <TableHead>Bulan</TableHead>
                  <TableHead className="text-right">Sakit</TableHead>
                  <TableHead className="text-right">Izin</TableHead>
                  <TableHead className="text-right">Alpa</TableHead>
                  <TableHead className="text-right">Hari Efektif</TableHead>
                </TableRow>
              ) : (
                <TableRow>
                  <TableHead>Kelas</TableHead>
                  <TableHead className="text-right">Total Siswa</TableHead>
                  <TableHead className="text-right">Sakit</TableHead>
                  <TableHead className="text-right">Izin</TableHead>
                  <TableHead className="text-right">Alpa</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {isBulanan ? (
                bulananRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">Belum ada data bulanan.</TableCell>
                  </TableRow>
                ) : (
                  bulananRows.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.bulan}</TableCell>
                      <TableCell className="text-right text-orange-600">{item.sakit}</TableCell>
                      <TableCell className="text-right text-blue-600">{item.izin}</TableCell>
                      <TableCell className="text-right text-red-600">{item.alpa}</TableCell>
                      <TableCell className="text-right">{item.efektif}</TableCell>
                    </TableRow>
                  ))
                )
              ) : harianRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada data harian.</TableCell>
                </TableRow>
              ) : (
                harianRows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.kelas}</TableCell>
                    <TableCell className="text-right">{item.total_siswa}</TableCell>
                    <TableCell className="text-right text-orange-600">{item.sakit}</TableCell>
                    <TableCell className="text-right text-blue-600">{item.izin}</TableCell>
                    <TableCell className="text-right text-red-600">{item.alpa}</TableCell>
                    <TableCell className="text-slate-500">{item.keterangan}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
