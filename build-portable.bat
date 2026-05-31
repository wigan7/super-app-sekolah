@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

title Super App Sekolah - Installer

echo.
echo ===================================================
echo   Super App Sekolah - Build dan Install Portable
echo ===================================================
echo   Direktori project: %PROJECT_DIR%
echo ===================================================
echo.

REM === [STEP 0] Cek apakah Node.js dan npm tersedia ===
echo [0/5] Memeriksa kebutuhan sistem...
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [ERROR] Node.js tidak ditemukan di komputer ini!
    echo.
    echo  Untuk membuild aplikasi, Anda perlu menginstal Node.js:
    echo    1. Buka https://nodejs.org
    echo    2. Download versi LTS ^(Recommended^)
    echo    3. Instal dengan pengaturan default
    echo    4. Restart komputer, lalu jalankan ulang script ini
    echo.
    pause
    exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [ERROR] npm tidak ditemukan!
    echo  Pastikan Node.js terinstal dengan benar.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo       Node.js %NODE_VER%, npm v%NPM_VER% - OK
echo.

REM === Pilih lokasi instalasi ===
echo Tentukan lokasi folder instalasi aplikasi:
echo   [1] C:\SuperAppSekolah (Rekomendasi)
echo   [2] Desktop
echo   [3] Lokasi Custom
echo.
set PILIHAN=1
set /p PILIHAN="Pilih opsi (1/2/3) [Default: 1]: "

if "%PILIHAN%"=="2" set "TARGET_DIR=%USERPROFILE%\Desktop\SuperAppSekolah"
if "%PILIHAN%"=="3" (
    set /p TARGET_DIR="Masukkan path lengkap: "
)
if not defined TARGET_DIR set "TARGET_DIR=C:\SuperAppSekolah"

echo.
echo  Target instalasi: %TARGET_DIR%
echo.

REM Pastikan folder tujuan bisa ditulis
mkdir "%TARGET_DIR%" 2>nul
echo test > "%TARGET_DIR%\_test.tmp" 2>nul
if not exist "%TARGET_DIR%\_test.tmp" (
    echo  [ERROR] Tidak bisa menulis ke: %TARGET_DIR%
    echo  Coba jalankan script ini sebagai Administrator,
    echo  atau pilih lokasi lain ^(misalnya Desktop^).
    echo.
    pause
    exit /b 1
)
del "%TARGET_DIR%\_test.tmp" 2>nul
echo  [OK] Folder tujuan siap.

REM === [STEP 1] Install Dependencies ===
echo.
echo ===================================================
echo  [1/5] Menginstal dependencies...
echo ===================================================
echo.
call npm install --prefer-offline 2>&1
if errorlevel 1 (
    echo.
    echo  [ERROR] Gagal menginstal dependencies!
    echo  Coba jalankan ulang script ini.
    echo  Jika masih gagal, pastikan koneksi internet aktif.
    echo.
    pause
    exit /b 1
)
echo.
echo  [OK] Dependencies terinstal.

REM === [STEP 2] Build Next.js ===
echo.
echo ===================================================
echo  [2/5] Membangun aplikasi Next.js...
echo         (Proses ini memakan waktu beberapa menit)
echo ===================================================
echo.
call npx next build --webpack
if errorlevel 1 (
    echo.
    echo  [ERROR] Build gagal!
    echo  Silakan screenshot error di atas dan hubungi developer.
    rmdir /s /q "%PROJECT_DIR%\.next" 2>nul
    pause
    exit /b 1
)
echo.
echo  [OK] Build selesai.

REM === [STEP 3] Install ke folder tujuan ===
echo.
echo ===================================================
echo  [3/5] Menginstal ke folder tujuan...
echo ===================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%PROJECT_DIR%\install-portable.ps1" -ProjectDir "%PROJECT_DIR%" -TargetDir "%TARGET_DIR%"
if errorlevel 1 (
    echo.
    echo  [ERROR] Instalasi gagal!
    echo  Silakan screenshot error di atas dan hubungi developer.
    rmdir /s /q "%PROJECT_DIR%\.next" 2>nul
    pause
    exit /b 1
)

REM === [STEP 4] Bersihkan workspace ===
echo.
echo ===================================================
echo  [4/5] Membersihkan file sementara...
echo ===================================================
rmdir /s /q "%PROJECT_DIR%\.next" 2>nul
echo  [OK] Workspace bersih.

REM === [STEP 5] Buat file ZIP untuk distribusi ===
echo.
echo ===================================================
echo  [5/5] Membuat file ZIP untuk distribusi...
echo ===================================================
set "ZIP_FILE=%PROJECT_DIR%\SuperAppSekolah-Portable.zip"
del "%ZIP_FILE%" 2>nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%TARGET_DIR%\*' -DestinationPath '%ZIP_FILE%' -Force" 2>nul
if exist "%ZIP_FILE%" (
    echo  [OK] File ZIP dibuat: %ZIP_FILE%
) else (
    echo  [INFO] Gagal membuat ZIP, tapi instalasi tetap berhasil.
)

REM === SELESAI ===
echo.
echo ===================================================
echo.
echo   INSTALASI BERHASIL!
echo.
echo   Aplikasi terinstal di:
echo     %TARGET_DIR%
echo.
echo   Cara menjalankan:
echo     1. Buka folder di atas
echo     2. Klik dua kali "Jalankan Aplikasi.bat"
echo     3. Browser akan terbuka otomatis
echo.
echo   Untuk distribusi ke komputer lain:
echo     Cukup copy folder "%TARGET_DIR%"
echo     atau gunakan file ZIP: SuperAppSekolah-Portable.zip
echo.
echo ===================================================
echo.

REM Buka folder hasil instalasi
explorer "%TARGET_DIR%"

pause
