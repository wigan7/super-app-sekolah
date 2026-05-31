@echo off
setlocal enabledelayedexpansion
echo.
echo ===================================================
echo Membangun Aplikasi Standalone (Portable)...
echo ===================================================

REM Tanyakan lokasi tujuan instalasi
echo Tentukan lokasi folder instalasi aplikasi:
echo [1] C:\SuperAppSekolah (Rekomendasi - Cepat ^& Mudah)
echo [2] C:\Program Files\SuperAppSekolah (Memerlukan Akses Administrator)
echo [3] Desktop (%%USERPROFILE%%\Desktop\SuperAppSekolah)
echo [4] Lokasi Custom (Tulis path sendiri)
echo.
set /p PILIHAN="Pilih opsi (1/2/3/4) [Default: 1]: "

if "%PILIHAN%"=="2" (
    set "TARGET_DIR=C:\Program Files\SuperAppSekolah"
) else if "%PILIHAN%"=="3" (
    set "TARGET_DIR=%USERPROFILE%\Desktop\SuperAppSekolah"
) else if "%PILIHAN%"=="4" (
    echo.
    set /p TARGET_DIR="Masukkan path lengkap folder tujuan: "
) else (
    set "TARGET_DIR=C:\SuperAppSekolah"
)

REM Bersihkan spasi/tanda kutip jika ada
set TARGET_DIR=%TARGET_DIR:"=%

echo.
echo Memverifikasi folder tujuan eksternal: %TARGET_DIR%
echo.

REM Cek apakah folder tujuan bisa dibuat/ditulis (LAKUKAN SEBELUM BUILD UNTUK MENCEGAH BLOAT!)
mkdir "%TARGET_DIR%" 2>nul
if not exist "%TARGET_DIR%" (
    echo.
    echo [ERROR] Gagal membuat folder tujuan: %TARGET_DIR%
    echo Harap jalankan script ini sebagai Administrator (Klik kanan -> Run as Administrator)
    echo atau pilih lokasi folder lainnya.
    echo.
    pause
    exit /b 1
)

REM Tes kemampuan menulis file di folder tujuan
echo. > "%TARGET_DIR%\perm_test.txt" 2>nul
if not exist "%TARGET_DIR%\perm_test.txt" (
    echo.
    echo [ERROR] Gagal menulis ke folder tujuan: %TARGET_DIR%
    echo Anda tidak memiliki izin menulis di folder ini.
    echo Harap jalankan script ini sebagai Administrator (Klik kanan -> Run as Administrator)
    echo atau pilih lokasi folder lainnya.
    echo.
    pause
    exit /b 1
)
del /f /q "%TARGET_DIR%\perm_test.txt" 2>nul

echo Folder tujuan terverifikasi! Memulai proses build...
echo.

REM Lakukan Next.js build
REM Gunakan --webpack karena Turbopack belum mendukung output: standalone
call npx next build --webpack

if errorlevel 1 (
    echo.
    echo [ERROR] Gagal melakukan build Next.js. Silakan periksa error di atas.
    echo.
    REM Bersihkan sisa build jika gagal demi menjaga kebersihan folder
    rmdir /s /q .next 2>nul
    pause
    exit /b 1
)

echo.
echo ===================================================
echo Menyiapkan Folder Instalasi...
echo ===================================================

REM Amankan node.exe jika sudah ada di folder tujuan agar tidak perlu download ulang
if exist "%TARGET_DIR%\node.exe" (
    echo Menemukan node.exe di folder tujuan, mengamankan sementara...
    move /Y "%TARGET_DIR%\node.exe" .\node_temp.exe >nul
)

REM Bersihkan folder tujuan (kecuali subfolder data jika ada agar data sekolah tidak hilang!)
echo Membersihkan file lama di folder instalasi...
for /d %%p in ("%TARGET_DIR%\*") do (
    if /i not "%%~nxp"=="data" rmdir /s /q "%%p"
)
for %%f in ("%TARGET_DIR%\*") do (
    if /i not "%%~nxf"=="node.exe" del /q "%%f"
)

if exist .\node_temp.exe (
    move /Y .\node_temp.exe "%TARGET_DIR%\node.exe" >nul
)

echo Menyalin file standalone...
xcopy /E /I /H /Y .next\standalone "%TARGET_DIR%\"

echo Menyalin folder public...
mkdir "%TARGET_DIR%\public" 2>nul
xcopy /E /I /H /Y public "%TARGET_DIR%\public\"

echo Menyalin folder .next\static...
mkdir "%TARGET_DIR%\.next\static" 2>nul
xcopy /E /I /H /Y .next\static "%TARGET_DIR%\.next\static\"

echo.
echo ===================================================
echo Memeriksa/Mengunduh Node.js Portable...
echo ===================================================
if not exist "%TARGET_DIR%\node.exe" (
    echo Mengunduh Node.js Portable...
    curl -# -Lo "%TARGET_DIR%\node.exe" https://nodejs.org/dist/v20.12.0/win-x64/node.exe
) else (
    echo Node.js Portable sudah ada. Pengunduhan dilewati!
)

echo.
echo ===================================================
echo Membuat Script Pendeteksi Port...
echo ===================================================
echo const net = require('net'); > "%TARGET_DIR%\get-port.js"
echo const server = net.createServer(); >> "%TARGET_DIR%\get-port.js"
echo server.listen(0, () =^> { >> "%TARGET_DIR%\get-port.js"
echo   console.log(server.address().port); >> "%TARGET_DIR%\get-port.js"
echo   server.close(); >> "%TARGET_DIR%\get-port.js"
echo }); >> "%TARGET_DIR%\get-port.js"

echo.
echo ===================================================
echo Membuat Shortcut "Jalankan Aplikasi.bat"...
echo ===================================================
(
echo @echo off
echo cd /d "%%~dp0"
echo echo Mencari port yang tidak terpakai...
echo for /f "tokens=*" %%%%i in ('node.exe get-port.js'^) do set PORT=%%%%i
echo echo Aplikasi akan berjalan pada port %%PORT%%
echo start http://localhost:%%PORT%%
echo node.exe server.js
echo pause
) > "%TARGET_DIR%\Jalankan Aplikasi.bat"

echo.
echo ===================================================
echo Membersihkan Folder Build Sementara di Workspace...
echo ===================================================
rmdir /s /q .next 2>nul
del /f /q .\node_temp.exe 2>nul

echo.
echo ===================================================
echo SELESAI! 
echo Aplikasi berhasil diinstal di: %TARGET_DIR%
echo.
echo Anda dapat menjalankan aplikasi dengan membuka folder tersebut
echo dan mengklik dua kali "Jalankan Aplikasi.bat".
echo ===================================================
pause
