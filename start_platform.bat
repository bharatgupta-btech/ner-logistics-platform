@echo off
title NER Smart Logistics Platform Launcher
echo =======================================================================
echo    NER Smart Logistics & Accessibility Intelligence Platform Launcher
echo =======================================================================
echo.

set "NODE_PATH=C:\Users\bhara\.gemini\antigravity\scratch\node"
set "PATH=%NODE_PATH%;%PATH%"

echo [1/2] Starting Node.js Backend Server on http://localhost:5000 ...
start "NER Logistics - Backend" cmd /k "cd /d %~dp0server && set PATH=%NODE_PATH%;%%PATH%% && node server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Vite Frontend Server on http://localhost:5173 ...
start "NER Logistics - Frontend" cmd /k "cd /d %~dp0client && set PATH=%NODE_PATH%;%%PATH%% && npm run dev -- --host 0.0.0.0 --port 5173"

timeout /t 3 /nobreak >nul

echo.
echo =======================================================================
echo SUCCESS! Platform servers are launching in separate windows.
echo Opening Chrome browser to http://localhost:5173 ...
echo =======================================================================
start http://localhost:5173

pause
