"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MutasiDialog from "./MutasiDialog";

type MutasiMasuk = {
  id: string;
  tanggal: string;
  nama: string;
  dari: string;
  kelas: string;
  keterangan: string;
};

type MutasiKeluar = {
  id: string;
  tanggal: string;
  nama: string;
  ke: string;
  kelas: string;
  keterangan: string;
};

export default function TabMutasi() {
  const [masukRows, setMasukRows] = useState<MutasiMasuk[]>([]);
  const [keluarRows, setKeluarRows] = useState<MutasiKeluar[]>([]);

  const fetchRows = async () => {
    try {
      const [masukRes, keluarRes] = await Promise.all([
        fetch("/api/data/kesiswaan/mutasiMasuk"),
        fetch("/api/data/kesiswaan/mutasiKeluar"),
      ]);

      if (masukRes.ok) {
        const data = await masukRes.json();
        setMasukRows(Array.isArray(data) ? data : []);
      }

      if (keluarRes.ok) {
        const data = await keluarRes.json();
        setKeluarRows(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat data mutasi:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">Buku Rekap Mutasi</CardTitle>
            <CardDescription>Catatan mutasi siswa masuk dan keluar / pindah.</CardDescription>
          </div>
          <MutasiDialog onSuccess={fetchRows} />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-emerald-500/20">
          <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 pb-4">
            <CardTitle className="text-emerald-700 dark:text-emerald-400 text-lg">Mutasi Masuk</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Sekolah Asal</TableHead>
                  <TableHead>Kelas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {masukRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">Belum ada data mutasi masuk.</TableCell>
                  </TableRow>
                ) : (
                  masukRows.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs text-slate-500">{item.tanggal}</TableCell>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell className="text-sm">{item.dari}</TableCell>
                      <TableCell className="text-center">{item.kelas}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-orange-500/20">
          <CardHeader className="bg-orange-50/50 dark:bg-orange-950/20 pb-4">
            <CardTitle className="text-orange-700 dark:text-orange-400 text-lg">Mutasi Keluar / Pindah</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Sekolah Tujuan</TableHead>
                  <TableHead>Kelas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keluarRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">Belum ada data mutasi keluar.</TableCell>
                  </TableRow>
                ) : (
                  keluarRows.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs text-slate-500">{item.tanggal}</TableCell>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell className="text-sm">{item.ke}</TableCell>
                      <TableCell className="text-center">{item.kelas}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
