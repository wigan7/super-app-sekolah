"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PendaftaranSheet from "./PendaftaranSheet";
import { motion, AnimatePresence } from "framer-motion";

export default function TabInduk() {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [namaSekolah, setNamaSekolah] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kesiswaan");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();

    const fetchSchoolName = async () => {
      try {
        const res = await fetch("/api/identitas");
        if (res.ok) {
          const data = await res.json();
          setNamaSekolah(data?.namaSekolah || "");
        }
      } catch (error) {
        console.error("Gagal memuat nama sekolah di kesiswaan:", error);
      }
    };
    fetchSchoolName();
  }, []);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Buku Induk & Klapper</CardTitle>
          <CardDescription>Kelola data induk seluruh siswa {namaSekolah || "(Belum input Nama Sekolah)"}.</CardDescription>
        </div>
        <PendaftaranSheet onSuccess={fetchData} />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="w-20">No</TableHead>
                <TableHead>NISN</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>L/P</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <motion.tr
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b transition-colors"
                    >
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    </motion.tr>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Belum ada data siswa.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((siswa, index) => (
                    <motion.tr
                      key={siswa.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{siswa.nisn}</TableCell>
                      <TableCell>{siswa.nama}</TableCell>
                      <TableCell>{siswa.kelas}</TableCell>
                      <TableCell>{siswa.jk}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20">
                          {siswa.status}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
