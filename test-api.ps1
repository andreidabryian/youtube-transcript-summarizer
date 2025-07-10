# Тестовый скрипт для проверки API
Write-Host "🧪 Тестирование YouTube Transcript Summarizer API" -ForegroundColor Green
Write-Host ""

# Тест 1: Проверка доступности Swagger
Write-Host "1. Проверка Swagger UI..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://localhost:7001/swagger" -UseBasicParsing
    Write-Host "✅ Swagger UI доступен (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Swagger UI недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 2: Проверка endpoint info
Write-Host "2. Тест endpoint /api/youtube/info..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://localhost:7001/api/youtube/info?videoUrl=https://www.youtube.com/watch?v=dQw4w9WgXcQ" -UseBasicParsing
    Write-Host "✅ Endpoint /info работает (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Ответ: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Endpoint /info не работает: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 3: Проверка endpoint check-transcript
Write-Host "3. Тест endpoint /api/youtube/check-transcript..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://localhost:7001/api/youtube/check-transcript?videoUrl=https://www.youtube.com/watch?v=dQw4w9WgXcQ" -UseBasicParsing
    Write-Host "✅ Endpoint /check-transcript работает (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Ответ: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Endpoint /check-transcript не работает: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Тест 4: Проверка POST endpoint summary
Write-Host "4. Тест POST endpoint /api/youtube/summary..." -ForegroundColor Yellow
try {
    $body = @{
        videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        maxPoints = 3
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $response = Invoke-WebRequest -Uri "https://localhost:7001/api/youtube/summary" -Method POST -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✅ POST endpoint /summary работает (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Ответ: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ POST endpoint /summary не работает: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Детали ошибки: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Тестирование завершено!" -ForegroundColor Green 