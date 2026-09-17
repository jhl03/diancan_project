@echo off
setlocal
cd /d "%~dp0"
start "" /min cmd /c "node 本地预览服务器.js"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8776/"
endlocal
