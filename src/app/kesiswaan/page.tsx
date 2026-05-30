import KesiswaanTabs from "./components/KesiswaanTabs";
import { Users } from "lucide-react";

export const metadata = {
  title: "Data Kesiswaan | Super App Sekolah",
  description: "Manajemen data kesiswaan terpadu",
};

export default function KesiswaanPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Data Kesiswaan
          </h2>
          <p className="text-muted-foreground mt-2">
            Kelola Buku Induk, Klapper, Presensi, Mutasi, dan Buku Akademik secara terpadu.
          </p>
        </div>
      </div>
      
      {/* Tabs Component (Client Side) */}
      <KesiswaanTabs />
    </div>
  );
}
