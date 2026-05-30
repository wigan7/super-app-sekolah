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

const mockPrestasi = [
  { no: 1, nama: "Ahmad Budi", jenis: "Lomba Cerdas Cermat", tingkat: "Kecamatan", juara: "Juara 1", tahun: "2025" },
];

export default function TabAkademik() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Akademik & Kelulusan</CardTitle>
        <CardDescription>Buku catatan prestasi, kenaikan kelas, dan administrasi kelulusan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion className="w-full">
          <AccordionItem value="prestasi">
            <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
              1. Buku Prestasi Siswa
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead className="w-[50px]">No</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Jenis Prestasi / Lomba</TableHead>
                      <TableHead>Tingkat</TableHead>
                      <TableHead>Peringkat</TableHead>
                      <TableHead>Tahun</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPrestasi.map((item) => (
                      <TableRow key={item.no}>
                        <TableCell>{item.no}</TableCell>
                        <TableCell className="font-medium">{item.nama}</TableCell>
                        <TableCell>{item.jenis}</TableCell>
                        <TableCell>{item.tingkat}</TableCell>
                        <TableCell className="text-emerald-600 font-medium">{item.juara}</TableCell>
                        <TableCell>{item.tahun}</TableCell>
                      </TableRow>
                    ))}
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
