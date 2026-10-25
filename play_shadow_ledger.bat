@echo off
title Shadow Ledger - Dev Server
echo ===================================================
echo     Launching Shadow Ledger (دفتر الظل)...
echo ===================================================
cd /d "C:\Users\lenovo\.gemini\antigravity-ide\scratch\shadow-ledger"
start "" "http://localhost:5173"
call npm run dev
pause
