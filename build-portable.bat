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
rmdir /s /q super-app-portable 2>nul
mkdir super-app-portable

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
echo Mengunduh Node.js Portable...
echo ===================================================
curl -# -Lo super-app-portable\node.exe https://nodejs.org/dist/v20.12.0/win-x64/node.exe

echo.
echo ===================================================
echo Membuat Shortcut "Jalankan Aplikasi.bat"...
echo ===================================================
(
echo @echo off
echo cd /d "%%~dp0"
echo echo Memulai server lokal...
echo start http://localhost:3000
echo node.exe server.js
echo pause
) > "super-app-portable\Jalankan Aplikasi.bat"

echo.
echo ===================================================
echo SELESAI! 
echo Folder "super-app-portable" siap digunakan.
echo Anda dapat menyalin folder tersebut dan menjalankannya
echo di komputer manapun dengan mengklik "Jalankan Aplikasi.bat".
echo ===================================================
pause
