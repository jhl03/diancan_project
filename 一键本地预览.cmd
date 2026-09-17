@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动本地预览服务，请不要关闭此窗口。
echo 打开后请从入口页进入三个系统。
node "%~dp0local-preview-server.js"
pause
