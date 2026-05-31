@echo off 
cd /d "%~dp0" 
echo Memulai server lokal... 
start http://localhost:3000 
node.exe server.js 
pause
