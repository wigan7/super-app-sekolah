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

# Bersihkan folder tujuan (lindungi folder data)
Write-Host "[1/6] Membersihkan folder tujuan..."
if (Test-Path $TargetDir) {
    Get-ChildItem $TargetDir -Exclude 'data','node.exe' | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

# Salin standalone
Write-Host "[2/6] Menyalin file standalone..."
$standaloneSrc = Join-Path $ProjectDir ".next\standalone\*"
Copy-Item -Path $standaloneSrc -Destination $TargetDir -Recurse -Force

# Salin public
Write-Host "[3/6] Menyalin folder public..."
$publicSrc = Join-Path $ProjectDir "public"
$publicDst = Join-Path $TargetDir "public"
Copy-Item -Path $publicSrc -Destination $publicDst -Recurse -Force

# Salin static
Write-Host "[4/6] Menyalin static assets..."
$staticSrc = Join-Path $ProjectDir ".next\static"
$staticDst = Join-Path $TargetDir ".next\static"
if (!(Test-Path $staticDst)) { New-Item -Path $staticDst -ItemType Directory -Force | Out-Null }
Copy-Item -Path "$staticSrc\*" -Destination $staticDst -Recurse -Force

# Buat get-port.js
Write-Host "[5/6] Membuat script pembantu..."
$getPortContent = @"
const net = require('net');
const server = net.createServer();
server.listen(0, () => {
  console.log(server.address().port);
  server.close();
});
"@
Set-Content -Path (Join-Path $TargetDir "get-port.js") -Value $getPortContent -Encoding UTF8

# Buat Jalankan Aplikasi.bat
$launcherContent = @"
@echo off
cd /d "%~dp0"
echo Mencari port yang tidak terpakai...
for /f "tokens=*" %%i in ('node.exe get-port.js') do set PORT=%%i
echo.
echo ===================================================
echo  Aplikasi berjalan di: http://localhost:%PORT%
echo  Tekan Ctrl+C untuk menghentikan server.
echo ===================================================
echo.
start http://localhost:%PORT%
node.exe server.js
pause
"@
Set-Content -Path (Join-Path $TargetDir "Jalankan Aplikasi.bat") -Value $launcherContent -Encoding ASCII

# Download node.exe jika belum ada
Write-Host "[6/6] Memeriksa Node.js Portable..."
$nodeExe = Join-Path $TargetDir "node.exe"
if (!(Test-Path $nodeExe)) {
    Write-Host "       Mengunduh Node.js Portable (~60MB)..."
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.12.0/win-x64/node.exe" -OutFile $nodeExe
} else {
    Write-Host "       Node.js sudah ada, dilewati."
}

# Verifikasi
Write-Host ""
$fileCount = (Get-ChildItem $TargetDir -File).Count
$folderCount = (Get-ChildItem $TargetDir -Directory).Count
Write-Host "[OK] Instalasi selesai! ($fileCount file, $folderCount folder)"
