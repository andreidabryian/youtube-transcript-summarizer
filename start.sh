#!/bin/bash

# YouTube Transcript Summarizer - Startup Script
# Bash script для запуска приложения на Linux/Mac

echo "🚀 Запуск YouTube Transcript Summarizer..."
echo ""

# Проверка наличия .NET 8
echo "📋 Проверка зависимостей..."
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    echo "✅ .NET версия: $DOTNET_VERSION"
else
    echo "❌ .NET не найден. Установите .NET 8 SDK"
    exit 1
fi

# Проверка наличия Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js версия: $NODE_VERSION"
else
    echo "❌ Node.js не найден. Установите Node.js 18+"
    exit 1
fi

# Проверка наличия Angular CLI
if command -v ng &> /dev/null; then
    ANGULAR_VERSION=$(ng version --json | jq -r '.angular')
    echo "✅ Angular CLI версия: $ANGULAR_VERSION"
else
    echo "⚠️  Angular CLI не найден. Устанавливаем..."
    npm install -g @angular/cli
fi

echo ""
echo "🔧 Настройка проекта..."

# Восстановление зависимостей .NET
echo "📦 Восстановление .NET зависимостей..."
dotnet restore

# Установка npm зависимостей
echo "📦 Установка npm зависимостей..."
cd client
npm install
cd ..

echo ""
echo "⚠️  ВАЖНО: Настройте API ключи в src/YouTubeTranscriptSummarizer.API/appsettings.json"
echo "   - Добавьте ваш OpenAI API ключ"
echo "   - Или настройте локальный LLM (Ollama)"
echo ""

read -p "Продолжить запуск? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Запуск отменен."
    exit 0
fi

echo ""
echo "🚀 Запуск приложения..."
echo ""

# Запуск Backend в фоновом режиме
echo "🔧 Запуск Backend API..."
cd src/YouTubeTranscriptSummarizer.API
dotnet run &
BACKEND_PID=$!
cd ../..

# Ожидание запуска Backend
echo "⏳ Ожидание запуска Backend..."
sleep 5

# Запуск Frontend
echo "🎨 Запуск Frontend..."
cd client
ng serve &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Приложение запущено!"
echo ""
echo "🌐 Доступные адреса:"
echo "   Frontend: http://localhost:4200"
echo "   Backend API: https://localhost:7001"
echo "   Swagger UI: https://localhost:7001/swagger"
echo ""
echo "📖 Документация: README.md"
echo ""
echo "🛑 Для остановки нажмите Ctrl+C"

# Функция для очистки при выходе
cleanup() {
    echo ""
    echo "🛑 Остановка приложения..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Приложение остановлено"
    exit 0
}

# Перехват сигналов для корректного завершения
trap cleanup SIGINT SIGTERM

# Ожидание завершения
wait 