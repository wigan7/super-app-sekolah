import PembelajaranTabs from "./components/PembelajaranTabs";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Pembelajaran & Kurikulum | Super App Sekolah",
  description: "Manajemen pembelajaran, supervisi, bimbingan, dan kurikulum",
};

export default function PembelajaranPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            Pembelajaran & Kurikulum
          </h2>
          <p className="text-muted-foreground mt-2">
            Kelola data operasional akademik: supervisi kelas, bimbingan siswa, progres kurikulum, dan rekam jejak kunjungan.
          </p>
        </div>
      </div>
      
      {/* Tabs Component (Client Side) */}
      <PembelajaranTabs />
    </div>
  );
}
