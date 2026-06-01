"use client";

import { useEffect, useState } from "react";
import { getSchoolData } from "@/lib/clientDb";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import { Printer, Loader2, Settings, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignatureBlock = ({ namaKS, nipKS, kabupaten, printDate }: { namaKS: string, nipKS: string, kabupaten?: string, printDate?: string }) => {
  const formattedDate = printDate ? new Date(printDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const location = kabupaten ? kabupaten.replace(/^(kabupaten|kab\.|kota)\s+/i, '') : 'Indonesia';

  return (
    <div className="mt-6 flex justify-end text-black break-inside-avoid">
      <div className="text-left w-64 text-xs">
        <p>{location}, {formattedDate}</p>
        <p className="font-semibold mt-0.5">Kepala Sekolah,</p>
        <div className="h-14" /> {/* Space for signature */}
        <p className="font-bold underline">{namaKS || "(Nama Kepala Sekolah)"}</p>
        <p className="text-[10px] text-gray-700">NIP. {nipKS || "-"}</p>
      </div>
    </div>
  );
};

const DataTable = ({ title, data, namaKS, nipKS, kabupaten, allowedKeys, printDate }: { title: string, data: any[], namaKS: string, nipKS: string, kabupaten?: string, allowedKeys?: string[], printDate?: string }) => {
  if (!data || data.length === 0) return null;

  // Pre-process data: Gabungkan elemen alamat jadi satu & hapus kolom yang tidak perlu
  const processedData = data.map(row => {
    const newRow = { ...row };
    
    // Cek apakah ada komponen alamat terpisah
    const hasAddressParts = newRow.alamat || newRow.Alamat || newRow.rt || newRow.Rt || newRow.dusun || newRow.Dusun || newRow.desa || newRow.Desa;
    
    if (hasAddressParts) {
      const parts = [];
      if (newRow.alamat || newRow.Alamat) parts.push(newRow.alamat || newRow.Alamat);
      if (newRow.dusun || newRow.Dusun) parts.push(newRow.dusun || newRow.Dusun);
      if (newRow.rt || newRow.Rt || newRow.rw || newRow.Rw) parts.push(`RT ${newRow.rt || newRow.Rt || '-'}/RW ${newRow.rw || newRow.Rw || '-'}`);
      if (newRow.desa || newRow.Desa || newRow.kelurahan || newRow.Kelurahan) parts.push(`Ds. ${newRow.desa || newRow.Desa || newRow.kelurahan || newRow.Kelurahan}`);
      if (newRow.kecamatan || newRow.Kecamatan) parts.push(`Kec. ${newRow.kecamatan || newRow.Kecamatan}`);
      if (newRow.kabupaten || newRow.Kabupaten) parts.push(newRow.kabupaten || newRow.Kabupaten);
      
      newRow['alamatLengkap'] = parts.filter(Boolean).join(', ');
      
      // Hapus kolom alamat individual
      const keysToRemove = ['alamat', 'Alamat', 'rt', 'Rt', 'rw', 'Rw', 'dusun', 'Dusun', 'desa', 'Desa', 'kelurahan', 'Kelurahan', 'kecamatan', 'Kecamatan', 'kabupaten', 'Kabupaten'];
      keysToRemove.forEach(k => delete newRow[k]);
    }

    // Gabungkan Tempat dan Tanggal Lahir
    const tempat = newRow['tempat lahir'] || newRow['Tempat Lahir'] || newRow.tempatLahir || newRow.TempatLahir;
    const tanggal = newRow['tanggal lahir'] || newRow['Tanggal Lahir'] || newRow.tanggalLahir || newRow.TanggalLahir;
    if (tempat || tanggal) {
      const ttlParts = [];
      if (tempat) ttlParts.push(tempat);
      if (tanggal) ttlParts.push(tanggal);
      
      newRow['tempatTanggalLahir'] = ttlParts.filter(Boolean).join(', ');
      
      const keysToRemoveTTL = ['tempat lahir', 'Tempat Lahir', 'tempatLahir', 'TempatLahir', 'tanggal lahir', 'Tanggal Lahir', 'tanggalLahir', 'TanggalLahir', 'tempat', 'Tempat', 'tanggal', 'Tanggal'];
      keysToRemoveTTL.forEach(k => delete newRow[k]);
    }

    // Hapus kolom yang secara eksplisit tidak diinginkan (seperti KIP, Jenis Tinggal, NIK, Status, Color)
    const unwanted = ['kip', 'Kip', 'namaKip', 'NamaKip', 'nama kip', 'jenis tinggal', 'jenisTinggal', 'JenisTinggal', 'nik', 'Nik', 'NIK', 'status', 'Status', 'color', 'Color', 'COLOR'];
    unwanted.forEach(k => delete newRow[k]);

    return newRow;
  });

  let keys = Object.keys(processedData[0]).filter(k => k !== 'id');
  
  if (allowedKeys) {
    keys = keys.filter(k => {
      const normalizedK = k.toLowerCase().replace(/\s+/g, '');
      return allowedKeys.some(ak => ak.toLowerCase().replace(/\s+/g, '') === normalizedK);
    });
    
    // Sort keys based on allowedKeys order
    keys.sort((a, b) => {
      const idxA = allowedKeys.findIndex(ak => ak.toLowerCase().replace(/\s+/g, '') === a.toLowerCase().replace(/\s+/g, ''));
      const idxB = allowedKeys.findIndex(ak => ak.toLowerCase().replace(/\s+/g, '') === b.toLowerCase().replace(/\s+/g, ''));
      return idxA - idxB;
    });
  } else if (keys.length > 7) {
    const essentialKeywords = [
      'nama', 'kelas', 'nisn', 'jk', 'jenis kelamin', 
      'alamatlengkap', 'jabatan', 'golongan', 'tempat tanggal'
    ];
    
    const scoredKeys = keys.map(k => {
      const lowerK = k.toLowerCase().replace(/\s+/g, '');
      let score = essentialKeywords.findIndex(ek => lowerK.includes(ek.replace(/\s+/g, '')));
      // Berikan prioritas "nama" yang tertinggi (indeks 0), dsb.
      // Jika tidak ada di keyword esensial, beri skor rendah (999) agar ditaruh di belakang
      if (score === -1) score = 999;
      return { k, score };
    });
    
    // Urutkan berdasarkan skor (yang ada di array essentialKeywords didahulukan)
    scoredKeys.sort((a, b) => a.score - b.score);
    // Ambil maksimal 7 kolom terpenting
    keys = scoredKeys.slice(0, 7).map(sk => sk.k);
  }

  return (
    <div className="mb-10 break-inside-avoid">
      <h3 className="text-lg font-bold mb-3 uppercase border-b-2 border-black pb-1">
        {title.replace(/([A-Z])/g, ' $1').trim()}
      </h3>
      <table className="w-full text-sm border-collapse border-2 border-black">
        <thead>
          <tr className="bg-slate-200 print:bg-gray-200 text-black">
            <th className="border-2 border-black px-2 py-1.5 text-center w-10 font-bold uppercase">No</th>
            {keys.map(k => (
              <th key={k} className="border-2 border-black px-2 py-1.5 capitalize text-left font-bold uppercase tracking-wider text-[11px]">
                {k.replace(/([A-Z])/g, ' $1').trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedData.map((row, i) => (
            <tr key={row.id || i} className="text-black even:bg-slate-50 print:even:bg-gray-50">
              <td className="border border-black px-2 py-1 text-center font-semibold text-xs">{i + 1}</td>
              {keys.map(k => {
                 const formatCellValue = (val: any): string => {
                   if (val === null || val === undefined) return "-";
                   if (typeof val === 'object') {
                     if (Array.isArray(val)) {
                       return val.map(item => formatCellValue(item)).join(", ");
                     }
                     const entries = Object.entries(val);
                     if (entries.length > 0) {
                       return entries.map(([key, value]) => {
                         const statusIcon = value === true || String(value).toLowerCase() === 'true' ? "✓" : "✗";
                         const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                         return `${capitalizedKey} (${statusIcon})`;
                       }).join(", ");
                     }
                     return JSON.stringify(val);
                   }
                   if (typeof val === 'boolean') {
                     return val ? "✓" : "✗";
                   }
                   return String(val);
                 };

                 return (
                   <td key={k} className="border border-black px-2 py-1 align-middle text-xs">
                     {formatCellValue(row[k])}
                   </td>
                 );
               })}
            </tr>
          ))}
        </tbody>
      </table>
      <SignatureBlock namaKS={namaKS} nipKS={nipKS} kabupaten={kabupaten} printDate={printDate} />
    </div>
  );
};

export default function CetakPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { headmasterData } = useAuth();
  
  const [paperSize, setPaperSize] = useState('A4');
  const [coverTitle, setCoverTitle] = useState('DOKUMEN ADMINISTRASI KEPALA SEKOLAH');
  const [coverFooter, setCoverFooter] = useState('Dinas Pendidikan dan Kebudayaan');

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [printDate, setPrintDate] = useState<string>(getTodayDateString());

  useEffect(() => {
    setData(getSchoolData());
    setLoading(false);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Menyiapkan data cetak...</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const identitas = data.identitas || {};
  const namaKS = headmasterData?.nama || identitas.namaKepalaSekolah || "";
  const nipKS = headmasterData?.nip || identitas.nipKepalaSekolah || "";

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 relative print:bg-white print:overflow-visible">
      {/* Settings Panel (Hidden on Print) */}
      <div className="print:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Cetak Dokumen</h1>
            <p className="text-sm text-slate-500">Konfigurasi dan pratinjau hasil cetak PDF</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 px-2">
            <Label className="text-xs font-semibold text-slate-600">Ukuran Kertas:</Label>
            <select 
              value={paperSize} 
              onChange={e => setPaperSize(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="A4">A4 (21 x 29.7 cm)</option>
              <option value="F4">F4 / Folio (21.59 x 33.02 cm)</option>
            </select>
          </div>
          <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 h-9 flex items-center gap-2 font-bold cursor-pointer transition-all active:scale-95 shadow-md">
            <Printer className="w-4 h-4" /> Cetak / PDF
          </Button>
        </div>
      </div>

      {/* Dynamic Print Style */}
      <style>{`
        @media print {
          @page {
            size: ${paperSize === 'F4' ? '21.59cm 33.02cm' : 'A4'};
            margin: 1.5cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: white;
          }
          .page-break {
            page-break-after: always;
          }
          .break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Print Content Preview Area */}
      <div className="p-4 md:p-8 print:p-0 max-w-[21cm] mx-auto flex flex-col gap-8 print:gap-0 origin-top">
        
        {/* Cover Configuration (Hidden on Print) */}
        <div className="print:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pengaturan Cetak Dokumen</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Judul Dokumen Besar</Label>
              <Input 
                value={coverTitle} 
                onChange={e => setCoverTitle(e.target.value)} 
                className="font-semibold text-sm h-10 bg-slate-50 focus-visible:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Teks Keterangan Footer</Label>
              <Input 
                value={coverFooter} 
                onChange={e => setCoverFooter(e.target.value)} 
                className="text-sm h-10 bg-slate-50 focus-visible:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Tanggal Cetak Dokumen</Label>
              <Input 
                type="date"
                value={printDate} 
                onChange={e => setPrintDate(e.target.value)} 
                className="text-sm h-10 bg-slate-50 focus-visible:bg-white"
              />
            </div>
          </div>
        </div>

        {/* --- PAGE 1: COVER --- */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 print:shadow-none print:border-none aspect-[1/1.414] print:aspect-auto print:min-h-[100vh] w-full flex flex-col items-center justify-center p-12 text-center page-break relative overflow-hidden shrink-0">
          <div className="absolute inset-5 border-[6px] border-double border-slate-800/80 rounded-lg pointer-events-none print:border-black"></div>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-16 w-full">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-slate-900 print:text-black px-12 leading-[1.3] text-balance">
              {coverTitle}
            </h1>
            
            <div className="relative">
              {identitas.logoSekolah ? (
                <div className="w-56 h-56 relative bg-white rounded-3xl p-2 drop-shadow-xl print:drop-shadow-none">
                  <Image src={identitas.logoSekolah} alt="Logo Sekolah" fill className="object-contain" />
                </div>
              ) : (
                <div className="w-48 h-48 border-4 border-dashed border-slate-300 rounded-[40px] flex items-center justify-center bg-slate-50 print:bg-white">
                  <span className="text-slate-400 font-bold">Logo Sekolah (Kosong)</span>
                </div>
              )}
            </div>

            <div className="space-y-3 px-8">
              <h2 className="text-3xl font-extrabold text-slate-800 print:text-black uppercase tracking-wide">
                {identitas.namaSekolah || "NAMA SEKOLAH BELUM DIATUR"}
              </h2>
              {identitas.npsn && (
                <p className="text-xl text-slate-600 print:text-black font-semibold tracking-widest">NPSN: {identitas.npsn}</p>
              )}
            </div>
          </div>

          <div className="mt-auto pt-10 border-t-4 border-slate-800 print:border-black w-4/5 max-w-lg">
            <p className="text-xl font-black text-slate-800 print:text-black uppercase tracking-wider">{coverFooter}</p>
            <p className="text-md text-slate-600 print:text-black font-bold mt-2 tracking-widest">{new Date().getFullYear()}</p>
          </div>
        </div>

        {/* --- PAGE 2: IDENTITAS --- */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 print:shadow-none print:border-none w-full p-12 page-break text-black print:text-black shrink-0 break-inside-avoid">
          <h1 className="text-2xl font-black text-center uppercase border-b-2 border-black pb-4 mb-8 tracking-wide">Identitas Sekolah</h1>
          
          <div className="space-y-8">
            <div>
              <table className="w-full text-sm leading-relaxed">
                <tbody>
                  <tr className="border-b border-gray-100/50"><td className="w-[30%] py-1.5 font-bold text-slate-700 print:text-black">Nama Sekolah</td><td className="w-6 text-center font-bold">:</td><td className="font-bold">{identitas.namaSekolah || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">NPSN</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.npsn || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Alamat</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.alamat || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Kelurahan / Desa</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.kelurahan || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Kecamatan</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.kecamatan || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Kabupaten / Kota</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.kabupaten || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Provinsi</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.provinsi || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Kode Pos</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.kodePos || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Telepon</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.telepon || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Email</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.email || "-"}</td></tr>
                  <tr className="border-b border-gray-100/50"><td className="py-1.5 font-bold text-slate-700 print:text-black">Website</td><td className="text-center font-bold">:</td><td className="font-medium">{identitas.website || "-"}</td></tr>
                </tbody>
              </table>
            </div>
            
            <SignatureBlock namaKS={namaKS} nipKS={nipKS} kabupaten={identitas.kabupaten} printDate={printDate} />
          </div>
        </div>

        {/* --- PAGE 3+: DATA KESISWAAN --- */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 print:shadow-none print:border-none min-h-[29.7cm] print:min-h-[100vh] w-full p-8 md:p-12 page-break text-black print:text-black shrink-0">
          <h1 className="text-2xl font-black text-center uppercase border-b-4 border-black pb-4 mb-8 tracking-wider">Dokumen Administrasi Kesiswaan</h1>
          {Object.entries(data.kesiswaan).map(([key, records]) => (
            <DataTable 
              key={key} 
              title={key} 
              data={records as any[]} 
              namaKS={namaKS} 
              nipKS={nipKS} 
              kabupaten={identitas.kabupaten} 
              allowedKeys={key === "induk" ? ["nama", "kelas", "nisn", "tempatTanggalLahir", "agama"] : undefined} 
              printDate={printDate}
            />
          ))}
          {Object.values(data.kesiswaan).every((v: any) => v.length === 0) && (
            <div className="border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 font-medium">Belum ada entri data kesiswaan.</div>
          )}
        </div>

        {/* --- DATA KEPEGAWAIAN --- */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 print:shadow-none print:border-none min-h-[29.7cm] print:min-h-[100vh] w-full p-8 md:p-12 page-break text-black print:text-black shrink-0">
          <h1 className="text-2xl font-black text-center uppercase border-b-4 border-black pb-4 mb-8 tracking-wider">Dokumen Administrasi Kepegawaian</h1>
          {Object.entries(data.kepegawaian).map(([key, records]) => (
            <DataTable key={key} title={key} data={records as any[]} namaKS={namaKS} nipKS={nipKS} kabupaten={identitas.kabupaten} printDate={printDate} />
          ))}
          {Object.values(data.kepegawaian).every((v: any) => v.length === 0) && (
             <div className="border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 font-medium">Belum ada entri data kepegawaian.</div>
          )}
        </div>

        {/* --- DATA PEMBELAJARAN --- */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 print:shadow-none print:border-none min-h-[29.7cm] print:min-h-[100vh] w-full p-8 md:p-12 page-break text-black print:text-black shrink-0">
          <h1 className="text-2xl font-black text-center uppercase border-b-4 border-black pb-4 mb-8 tracking-wider">Dokumen Administrasi Pembelajaran</h1>
          {Object.entries(data.pembelajaran).map(([key, records]) => (
            <DataTable key={key} title={key} data={records as any[]} namaKS={namaKS} nipKS={nipKS} kabupaten={identitas.kabupaten} printDate={printDate} />
          ))}
          {Object.values(data.pembelajaran).every((v: any) => v.length === 0) && (
             <div className="border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 font-medium">Belum ada entri data pembelajaran.</div>
          )}
        </div>

        {/* --- DATA PKKS --- */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 print:shadow-none print:border-none min-h-[29.7cm] print:min-h-[100vh] w-full p-8 md:p-12 text-black print:text-black shrink-0">
          <h1 className="text-2xl font-black text-center uppercase border-b-4 border-black pb-4 mb-10 tracking-wider">Rangkuman Penilaian Kinerja Kepala Sekolah (PKKS)</h1>
          
          <div className="mb-12 break-inside-avoid">
            <h3 className="text-xl font-bold mb-4 uppercase border-b-2 border-black pb-2 bg-slate-100 print:bg-gray-100 px-3 pt-2">Indikator yang Telah Diselesaikan</h3>
            {Object.keys(data.pkks?.completedIndicators || {}).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 px-4 mt-4">
                {Object.entries(data.pkks.completedIndicators).filter(([_, v]) => v).map(([k]) => (
                  <div key={k} className="flex items-start gap-2 text-sm font-medium border-b border-gray-200 pb-1">
                    <span className="text-green-600 print:text-black font-bold">✓</span>
                    <span className="leading-tight">{k}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 p-6 text-center text-gray-500 font-medium mt-4">Belum ada indikator PKKS yang ditandai selesai.</div>
            )}
          </div>

          <div className="mb-8 break-inside-avoid">
            <h3 className="text-xl font-bold mb-4 uppercase border-b-2 border-black pb-2 bg-slate-100 print:bg-gray-100 px-3 pt-2">Tautan Bukti Fisik Tersimpan</h3>
            {Object.keys(data.pkks?.links || {}).length > 0 ? (
              <div className="space-y-4 px-4 mt-4">
                {Object.entries(data.pkks.links).filter(([_, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex flex-col text-sm border-b border-gray-200 pb-2">
                    <span className="font-bold text-slate-800 print:text-black">{k}</span>
                    <a href={v as string} target="_blank" rel="noreferrer" className="text-blue-600 print:text-black print:underline hover:underline break-all mt-1 font-mono text-xs">
                      {v as string}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
               <div className="border-2 border-dashed border-gray-300 p-6 text-center text-gray-500 font-medium mt-4">Belum ada tautan bukti fisik yang dimasukkan.</div>
            )}
          </div>
          <SignatureBlock namaKS={namaKS} nipKS={nipKS} kabupaten={identitas.kabupaten} printDate={printDate} />
        </div>

      </div>
    </div>
  );
}
