@echo off
echo.
echo ===================================================
echo Membangun Aplikasi Standalone (Portable)...
echo ===================================================
REM Gunakan --webpack karena Turbopack belum mendukung output: standalone
call npx next build --webpack

echo.
echo ===================================================
echo Menyiapkan Folder Portable...
echo ===================================================
REM Amankan node.exe jika sudah ada agar tidak perlu download ulang
if exist super-app-portable\node.exe (
    echo Menemukan node.exe, mengamankan sementara...
    move /Y super-app-portable\node.exe .\node_temp.exe >nul
)

rmdir /s /q super-app-portable 2>nul
mkdir super-app-portable

if exist .\node_temp.exe (
    move /Y .\node_temp.exe super-app-portable\node.exe >nul
)

echo Menyalin file standalone...
xcopy /E /I /H /Y .next\standalone super-app-portable\

echo Menyalin folder public...
mkdir super-app-portable\public
xcopy /E /I /H /Y public super-app-portable\public\

echo Menyalin folder .next\static...
mkdir super-app-portable\.next\static
xcopy /E /I /H /Y .next\static super-app-portable\.next\static\

echo.
echo ===================================================
echo Memeriksa/Mengunduh Node.js Portable...
echo ===================================================
if not exist super-app-portable\node.exe (
    echo Mengunduh Node.js Portable...
    curl -# -Lo super-app-portable\node.exe https://nodejs.org/dist/v20.12.0/win-x64/node.exe
) else (
    echo Node.js Portable sudah ada. Pengunduhan dilewati!
)

echo.
echo ===================================================
echo Membuat Script Pendeteksi Port...
echo ===================================================
echo const net = require('net'); > "super-app-portable\get-port.js"
echo const server = net.createServer(); >> "super-app-portable\get-port.js"
echo server.listen(0, () =^> { >> "super-app-portable\get-port.js"
echo   console.log(server.address().port); >> "super-app-portable\get-port.js"
echo   server.close(); >> "super-app-portable\get-port.js"
echo }); >> "super-app-portable\get-port.js"

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
) > "super-app-portable\Jalankan Aplikasi.bat"

echo.
echo ===================================================
echo Membersihkan Folder Build Sementara (.next)...
echo ===================================================
rmdir /s /q .next 2>nul
del /f /q .\node_temp.exe 2>nul

echo.
echo ===================================================
echo SELESAI! 
echo Folder "super-app-portable" siap digunakan.
echo Anda dapat menyalin folder tersebut dan menjalankannya
echo di komputer manapun dengan mengklik "Jalankan Aplikasi.bat".
echo ===================================================
pause
