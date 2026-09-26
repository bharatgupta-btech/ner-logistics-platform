@echo off
title NER Logistics Platform - Live Public Tunnel
echo ========================================================
echo   Launching Auto-Reconnecting Public Live Sharing Link
echo ========================================================
:loop
echo [%time%] Connecting to tunnel server...
ssh -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=no -R 80:127.0.0.1:5173 serveo.net
echo [%time%] Tunnel disconnected. Reconnecting in 3 seconds...
timeout /t 3 /nobreak > nul
goto loop
