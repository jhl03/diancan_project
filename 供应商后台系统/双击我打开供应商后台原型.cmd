@echo off
setlocal
cd /d "%~dp0"
start "" /b "E:\nvm\nodejs\node.exe" "%~dp0本地预览服务器.js"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8773/"
endlocal
