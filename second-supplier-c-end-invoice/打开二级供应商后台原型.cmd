@echo off
cd /d "%~dp0"
start "二级供应商后台原型服务" /min node "%~dp0本地预览服务器.js"
timeout /t 2 >nul
start "" "http://127.0.0.1:8775/"
