import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileOutput } from "lucide-react";

export default function MutasiDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950" />}>
        <FileOutput className="mr-2 h-4 w-4" />
        Cetak Surat Pindah
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cetak Surat Pindah</DialogTitle>
          <DialogDescription>
            Masukkan detail untuk mencetak surat keterangan pindah sekolah.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nama_siswa">Nama Siswa</Label>
            <Input id="nama_siswa" placeholder="Cari nama siswa..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sekolah_tujuan">Sekolah Tujuan</Label>
            <Input id="sekolah_tujuan" placeholder="Nama sekolah tujuan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alasan">Alasan Pindah</Label>
            <Input id="alasan" placeholder="Alasan perpindahan" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline">Batal</Button>
          <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">Cetak Dokumen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
