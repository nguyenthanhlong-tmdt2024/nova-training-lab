@echo off
cd /d "%~dp0"
node -e "fetch('http://localhost:3000').then(r=>r.text()).then(t=>process.exit(t.includes('NOVA TRAINING LAB')?0:1)).catch(()=>process.exit(1))" >nul 2>&1
if not errorlevel 1 (
  start "" http://localhost:3000
  exit /b 0
)
start "" http://localhost:3000
call npm run dev -- --port 3000
