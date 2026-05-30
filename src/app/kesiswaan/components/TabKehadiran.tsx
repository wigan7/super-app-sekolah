"use client";

import { useState } from "react";
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

const mockHarian = [
  { kelas: "1A", sakit: 1, izin: 0, alpa: 0, total_siswa: 28, keterangan: "Sakit: Ahmad" },
  { kelas: "1B", sakit: 0, izin: 1, alpa: 0, total_siswa: 27, keterangan: "Izin: Siti (Acara keluarga)" },
  { kelas: "2A", sakit: 0, izin: 0, alpa: 0, total_siswa: 30, keterangan: "Nihil" },
  { kelas: "3A", sakit: 2, izin: 0, alpa: 1, total_siswa: 29, keterangan: "Sakit: Budi, Caca; Alpa: Doni" },
];

const mockBulanan = [
  { bulan: "Juli", sakit: 12, izin: 5, alpa: 2, efektif: 22 },
  { bulan: "Agustus", sakit: 8, izin: 10, alpa: 4, efektif: 24 },
  { bulan: "September", sakit: 15, izin: 2, alpa: 1, efektif: 21 },
];

export default function TabKehadiran() {
  const [isBulanan, setIsBulanan] = useState(false);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Papan Absen</CardTitle>
          <CardDescription>
            {isBulanan ? "Rekapitulasi kehadiran bulanan siswa." : "Pantauan kehadiran harian siswa per kelas."}
          </CardDescription>
        </div>
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
                mockBulanan.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.bulan}</TableCell>
                    <TableCell className="text-right text-orange-600">{item.sakit}</TableCell>
                    <TableCell className="text-right text-blue-600">{item.izin}</TableCell>
                    <TableCell className="text-right text-red-600">{item.alpa}</TableCell>
                    <TableCell className="text-right">{item.efektif}</TableCell>
                  </TableRow>
                ))
              ) : (
                mockHarian.map((item, i) => (
                  <TableRow key={i}>
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
