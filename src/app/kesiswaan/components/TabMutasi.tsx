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

const mockMasuk = [
  { tanggal: "10 Jul 2026", nama: "Farhan Maulana", dari: "SDN Karangjati 01", kelas: "4A", keterangan: "Ikut Orangtua" },
  { tanggal: "15 Jul 2026", nama: "Nisa Azzahra", dari: "MI Al-Huda", kelas: "3B", keterangan: "Pindah Domisili" },
];

const mockKeluar = [
  { tanggal: "05 Jun 2026", nama: "Kevin Sanjaya", ke: "SDN Ngampin 02", kelas: "5B", keterangan: "Pindah Domisili" },
];

export default function TabMutasi() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">Buku Rekap Mutasi</CardTitle>
            <CardDescription>Catatan mutasi siswa masuk dan keluar / pindah.</CardDescription>
          </div>
          <MutasiDialog />
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
                {mockMasuk.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-slate-500">{item.tanggal}</TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell className="text-sm">{item.dari}</TableCell>
                    <TableCell className="text-center">{item.kelas}</TableCell>
                  </TableRow>
                ))}
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
                {mockKeluar.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-slate-500">{item.tanggal}</TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell className="text-sm">{item.ke}</TableCell>
                    <TableCell className="text-center">{item.kelas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
