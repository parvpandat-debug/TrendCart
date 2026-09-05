# TrendCart Full-Stack Startup Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting TrendCart — AI Growth & Agentic Commerce " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Start Backend in separate process
Write-Host "`n[1/2] Launching FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
$backendProcess = Start-Process python -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload" -WorkingDirectory "$PSScriptRoot\backend" -PassThru

Start-Sleep -Seconds 2

# 2. Start Frontend
Write-Host "`n[2/2] Launching Vite Frontend on http://localhost:5173..." -ForegroundColor Green
$frontendProcess = Start-Process npm -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru

Write-Host "`n>>> Both services started!" -ForegroundColor Cyan
Write-Host "Backend API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Gray
Write-Host "Frontend App:     http://localhost:5173" -ForegroundColor Gray
Write-Host "`nPress Ctrl+C to exit.`n"
