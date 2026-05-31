# install-portable.ps1
# Script PowerShell untuk menyalin hasil build ke folder tujuan
param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectDir,
    
    [Parameter(Mandatory=$true)]
    [string]$TargetDir
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==================================================="
Write-Host " Menginstal ke: $TargetDir"
Write-Host "==================================================="

# Bersihkan folder tujuan (lindungi folder data dan node.exe)
Write-Host "[1/7] Membersihkan folder tujuan..."
if (Test-Path $TargetDir) {
    Get-ChildItem $TargetDir -Exclude 'data','node.exe' | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

# Salin standalone
Write-Host "[2/7] Menyalin file standalone..."
$standaloneSrc = Join-Path $ProjectDir ".next\standalone\*"
if (!(Test-Path (Join-Path $ProjectDir ".next\standalone"))) {
    Write-Host "[ERROR] Folder standalone tidak ditemukan!"
    Write-Host "        Pastikan build berhasil sebelum menjalankan instalasi."
    exit 1
}
Copy-Item -Path $standaloneSrc -Destination $TargetDir -Recurse -Force

# Salin public
Write-Host "[3/7] Menyalin folder public..."
$publicSrc = Join-Path $ProjectDir "public"
$publicDst = Join-Path $TargetDir "public"
Copy-Item -Path $publicSrc -Destination $publicDst -Recurse -Force

# Salin static
Write-Host "[4/7] Menyalin static assets..."
$staticSrc = Join-Path $ProjectDir ".next\static"
$staticDst = Join-Path $TargetDir ".next\static"
if (!(Test-Path $staticDst)) { New-Item -Path $staticDst -ItemType Directory -Force | Out-Null }
Copy-Item -Path "$staticSrc\*" -Destination $staticDst -Recurse -Force

# Salin folder data jika ada dan belum ada di tujuan
Write-Host "[5/7] Memeriksa folder data..."
$dataSrc = Join-Path $ProjectDir "data"
$dataDst = Join-Path $TargetDir "data"
if ((Test-Path $dataSrc) -and !(Test-Path $dataDst)) {
    Copy-Item -Path $dataSrc -Destination $dataDst -Recurse -Force
    Write-Host "       Folder data disalin."
} else {
    Write-Host "       Folder data sudah ada atau tidak diperlukan, dilewati."
}

# Buat get-port.js
Write-Host "[6/7] Membuat script pembantu..."
$getPortContent = @"
const net = require('net');
const server = net.createServer();
server.listen(0, () => {
  console.log(server.address().port);
  server.close();
});
"@
Set-Content -Path (Join-Path $TargetDir "get-port.js") -Value $getPortContent -Encoding UTF8

# Buat Jalankan Aplikasi.bat (user-friendly launcher)
$launcherContent = @"
@echo off
chcp 65001 >nul 2>&1
title Super App Sekolah
cd /d "%~dp0"

echo.
echo  ===================================================
echo      Super App Sekolah
echo  ===================================================
echo.

REM Cek apakah node.exe ada
if not exist "node.exe" (
    echo  [ERROR] File node.exe tidak ditemukan!
    echo.
    echo  Pastikan file node.exe ada di folder yang sama
    echo  dengan file ini.
    echo.
    echo  Hubungi administrator untuk bantuan.
    echo.
    pause
    exit /b 1
)

REM Cek apakah server.js ada
if not exist "server.js" (
    echo  [ERROR] File server.js tidak ditemukan!
    echo.
    echo  Aplikasi mungkin belum terinstal dengan benar.
    echo  Hubungi administrator untuk bantuan.
    echo.
    pause
    exit /b 1
)

echo  Mempersiapkan aplikasi...
echo.

REM Cari port yang tersedia
for /f "tokens=*" %%i in ('node.exe get-port.js 2^>nul') do set PORT=%%i
if not defined PORT set PORT=3000

echo  ===================================================
echo.
echo   Aplikasi berjalan di:
echo.
echo       http://localhost:%PORT%
echo.
echo   Browser akan terbuka otomatis.
echo   Jangan tutup jendela ini selama aplikasi berjalan.
echo.
echo   Untuk menghentikan: tutup jendela ini atau
echo   tekan Ctrl+C
echo.
echo  ===================================================
echo.

REM Buka browser otomatis
start "" "http://localhost:%PORT%"

REM Jalankan server
set PORT=%PORT%
node.exe server.js

echo.
echo  Aplikasi telah dihentikan.
pause
"@
Set-Content -Path (Join-Path $TargetDir "Jalankan Aplikasi.bat") -Value $launcherContent -Encoding ASCII

# Buat README.txt agar user tahu cara pakai
$readmeContent = @"
===================================================
 SUPER APP SEKOLAH - Panduan Penggunaan
===================================================

CARA MENJALANKAN:
  1. Klik dua kali file "Jalankan Aplikasi.bat"
  2. Tunggu beberapa detik
  3. Browser akan terbuka otomatis
  4. Jangan tutup jendela hitam (Command Prompt)
     selama aplikasi berjalan

CARA MENGHENTIKAN:
  - Tutup jendela hitam (Command Prompt), atau
  - Tekan Ctrl+C di jendela tersebut

PENTING:
  - Jangan menghapus atau memindahkan file-file
    di dalam folder ini
  - Folder "data" berisi data aplikasi, jangan dihapus
  - Aplikasi tidak memerlukan koneksi internet
    untuk berjalan

MASALAH?
  - Jika browser tidak terbuka otomatis, buka manual
    dan ketik alamat yang tertera di jendela hitam
  - Jika ada error, screenshot jendela hitam dan
    hubungi administrator

===================================================
"@
Set-Content -Path (Join-Path $TargetDir "BACA INI.txt") -Value $readmeContent -Encoding UTF8

# Download node.exe jika belum ada
Write-Host "[7/7] Memeriksa Node.js Portable..."
$nodeExe = Join-Path $TargetDir "node.exe"
if (!(Test-Path $nodeExe)) {
    Write-Host "       Mengunduh Node.js Portable (~30MB)..."
    Write-Host "       (Memerlukan koneksi internet)"
    
    $maxRetries = 3
    $retryCount = 0
    $downloaded = $false
    
    while (-not $downloaded -and $retryCount -lt $maxRetries) {
        try {
            $retryCount++
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.12.0/win-x64/node.exe" -OutFile $nodeExe -UseBasicParsing
            $downloaded = $true
            Write-Host "       Download berhasil!"
        } catch {
            Write-Host "       Percobaan $retryCount/$maxRetries gagal: $($_.Exception.Message)"
            if ($retryCount -lt $maxRetries) {
                Write-Host "       Mencoba ulang dalam 3 detik..."
                Start-Sleep -Seconds 3
            }
        }
    }
    
    if (-not $downloaded) {
        Write-Host ""
        Write-Host "[ERROR] Gagal mengunduh Node.js setelah $maxRetries percobaan!"
        Write-Host "        Pastikan koneksi internet aktif dan coba lagi."
        Write-Host ""
        Write-Host "        Alternatif: download manual dari"
        Write-Host "        https://nodejs.org/dist/v20.12.0/win-x64/node.exe"
        Write-Host "        dan simpan ke: $TargetDir"
        exit 1
    }
} else {
    Write-Host "       Node.js sudah ada, dilewati."
}

# Verifikasi
Write-Host ""
$fileCount = (Get-ChildItem $TargetDir -File).Count
$folderCount = (Get-ChildItem $TargetDir -Directory).Count
Write-Host "[OK] Instalasi selesai! ($fileCount file, $folderCount folder)"
