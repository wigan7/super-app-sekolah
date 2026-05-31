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
import { Plus } from "lucide-react";

type PrestasiRow = {
  id: string;
  nama: string;
  jenis: string;
  tingkat: string;
  juara: string;
  tahun: string;
};

const EMPTY_FORM = {
  nama: "",
  jenis: "",
  tingkat: "",
  juara: "",
  tahun: "",
};

export default function TabAkademik() {
  const [rows, setRows] = useState<PrestasiRow[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/data/kesiswaan/akademikPrestasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Gagal menyimpan data prestasi.");
        return;
      }

      setForm(EMPTY_FORM);
      setOpen(false);
      await fetchRows();
    } catch (error) {
      console.error("Gagal menyimpan data akademik:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4 flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-semibold">Akademik & Kelulusan</CardTitle>
          <CardDescription>Buku catatan prestasi, kenaikan kelas, dan administrasi kelulusan.</CardDescription>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700 text-white" />}>
            <Plus className="h-4 w-4 mr-2" />
            Input Prestasi
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Input Prestasi Siswa</DialogTitle>
              <DialogDescription>Tambahkan data prestasi baru ke buku akademik.</DialogDescription>
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
              <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Batal</Button>
              <Button onClick={handleSubmit} disabled={saving}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Accordion className="w-full" defaultValue={["prestasi"]}>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-slate-500">
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
              <div className="py-8 text-center text-slate-500 border rounded-md mt-2 border-dashed">
                <p>Data buku kenaikan kelas belum tersedia untuk tahun ajaran ini.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ujian">
            <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
              3. Rekapitulasi Hasil Ujian / UAMBN
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-8 text-center text-slate-500 border rounded-md mt-2 border-dashed">
                <p>Data rekapitulasi ujian akhir belum diunggah.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ijazah">
            <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
              4. Buku Penyerahan Ijazah & Raport
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-8 text-center text-slate-500 border rounded-md mt-2 border-dashed">
                <p>Belum ada jadwal penyerahan ijazah dalam waktu dekat.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
