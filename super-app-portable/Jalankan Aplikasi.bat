@echo off
cd /d "%~dp0"
echo Mencari port yang tidak terpakai...
for /f "tokens=*" %%i in ('node.exe get-port.js') do set PORT=%%i
echo Aplikasi akan berjalan pada port %PORT%
start http://localhost:%PORT%
node.exe server.js
pause
