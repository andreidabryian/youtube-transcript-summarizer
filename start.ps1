# YouTube Transcript Summarizer - Startup Script
# PowerShell script для запуска приложения

Write-Host "🚀 Запуск YouTube Transcript Summarizer..." -ForegroundColor Green
Write-Host ""

# Проверка наличия .NET 8
Write-Host "📋 Проверка зависимостей..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET версия: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET не найден. Установите .NET 8 SDK" -ForegroundColor Red
    exit 1
}

# Проверка наличия Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js версия: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не найден. Установите Node.js 18+" -ForegroundColor Red
    exit 1
}

# Проверка наличия Angular CLI
try {
    $angularVersion = ng version --json | ConvertFrom-Json
    Write-Host "✅ Angular CLI версия: $($angularVersion.angular)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Angular CLI не найден. Устанавливаем..." -ForegroundColor Yellow
    npm install -g @angular/cli
}

Write-Host ""
Write-Host "🔧 Настройка проекта..." -ForegroundColor Yellow

# Восстановление зависимостей .NET
Write-Host "📦 Восстановление .NET зависимостей..." -ForegroundColor Cyan
dotnet restore

# Установка npm зависимостей
Write-Host "📦 Установка npm зависимостей..." -ForegroundColor Cyan
Set-Location client
npm install
Set-Location ..

Write-Host ""
Write-Host "⚠️  ВАЖНО: Настройте API ключи в src/YouTubeTranscriptSummarizer.API/appsettings.json" -ForegroundColor Yellow
Write-Host "   - Добавьте ваш OpenAI API ключ" -ForegroundColor Yellow
Write-Host "   - Или настройте локальный LLM (Ollama)" -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Продолжить запуск? (y/n)"
if ($response -ne "y" -and $response -ne "Y") {
    Write-Host "Запуск отменен." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Запуск приложения..." -ForegroundColor Green
Write-Host ""

# Запуск Backend в фоновом режиме
Write-Host "🔧 Запуск Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\src\YouTubeTranscriptSummarizer.API'; dotnet run"

# Ожидание запуска Backend
Write-Host "⏳ Ожидание запуска Backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Запуск Frontend
Write-Host "🎨 Запуск Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; ng serve"

Write-Host ""
Write-Host "✅ Приложение запущено!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Доступные адреса:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "   Backend API: https://localhost:7001" -ForegroundColor Cyan
Write-Host "   Swagger UI: https://localhost:7001/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Документация: README.md" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Для остановки закройте окна терминалов" -ForegroundColor Yellow 