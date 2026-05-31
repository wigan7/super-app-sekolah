@echo off
cd /d "%~dp0"

set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo.
echo ===================================================
echo  Super App Sekolah - Build dan Install Portable
echo ===================================================
echo  Direktori project: %PROJECT_DIR%
echo ===================================================
echo.
echo Tentukan lokasi folder instalasi aplikasi:
echo [1] C:\SuperAppSekolah (Rekomendasi)
echo [2] C:\Program Files\SuperAppSekolah (Perlu Administrator)
echo [3] Desktop
echo [4] Lokasi Custom
echo.
set PILIHAN=1
set /p PILIHAN="Pilih opsi (1/2/3/4) [Default: 1]: "

if "%PILIHAN%"=="2" set "TARGET_DIR=C:\Program Files\SuperAppSekolah"
if "%PILIHAN%"=="3" set "TARGET_DIR=%USERPROFILE%\Desktop\SuperAppSekolah"
if "%PILIHAN%"=="4" (
    set /p TARGET_DIR="Masukkan path lengkap: "
)
if not defined TARGET_DIR set "TARGET_DIR=C:\SuperAppSekolah"

echo.
echo Target instalasi: %TARGET_DIR%
echo.

REM Pastikan folder tujuan bisa ditulis
mkdir "%TARGET_DIR%" 2>nul
echo test > "%TARGET_DIR%\_test.tmp" 2>nul
if not exist "%TARGET_DIR%\_test.tmp" (
    echo [ERROR] Tidak bisa menulis ke: %TARGET_DIR%
    echo Jalankan sebagai Administrator atau pilih lokasi lain.
    pause
    exit /b 1
)
del "%TARGET_DIR%\_test.tmp" 2>nul
echo [OK] Folder tujuan siap.

REM === Build Next.js ===
echo.
echo ===================================================
echo  Membangun aplikasi Next.js...
echo ===================================================
echo.
call npx next build --webpack
if errorlevel 1 (
    echo.
    echo [ERROR] Build gagal!
    rmdir /s /q "%PROJECT_DIR%\.next" 2>nul
    pause
    exit /b 1
)
echo.
echo [OK] Build selesai.

REM === Install menggunakan PowerShell ===
echo.
echo ===================================================
echo  Menginstal ke folder tujuan...
echo ===================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%PROJECT_DIR%\install-portable.ps1" -ProjectDir "%PROJECT_DIR%" -TargetDir "%TARGET_DIR%"
if errorlevel 1 (
    echo.
    echo [ERROR] Instalasi gagal!
    rmdir /s /q "%PROJECT_DIR%\.next" 2>nul
    pause
    exit /b 1
)

REM === Bersihkan workspace ===
echo.
echo Membersihkan workspace...
rmdir /s /q "%PROJECT_DIR%\.next" 2>nul
echo [OK] Workspace bersih.

echo.
echo ===================================================
echo  SELESAI!
echo  Aplikasi diinstal di: %TARGET_DIR%
echo.
echo  Buka folder tersebut dan klik dua kali
echo  "Jalankan Aplikasi.bat" untuk menjalankan.
echo ===================================================
pause
