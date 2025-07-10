# Установка и запуск Angular 19

## 🚀 Быстрая установка Node.js

### Вариант 1: Официальный сайт (рекомендуется)
1. Скачайте Node.js с https://nodejs.org/
2. Выберите LTS версию (20.x или выше)
3. Запустите установщик и следуйте инструкциям
4. Перезапустите PowerShell

### Вариант 2: Через winget (Windows 10/11)
```powershell
winget install OpenJS.NodeJS
```

### Вариант 3: Через Chocolatey
```powershell
choco install nodejs
```

## ✅ Проверка установки

```powershell
node --version  # Должно быть 20.x или выше
npm --version   # Должно быть 10.x или выше
```

## 🎯 Установка Angular CLI 19

```powershell
npm install -g @angular/cli@19
```

## 🚀 Запуск приложения

### Автоматический запуск (рекомендуется)
```powershell
.\start.ps1
```

### Ручной запуск

#### 1. Backend (.NET 9)
```powershell
cd src\YouTubeTranscriptSummarizer.API
dotnet restore
dotnet run
```

#### 2. Frontend (Angular 19)
В новом терминале:
```powershell
cd client
npm install
ng serve
```

## 🌐 Доступные адреса

- **Frontend**: http://localhost:4200
- **Backend API**: https://localhost:7001
- **Swagger UI**: https://localhost:7001/swagger

## ⚙️ Настройка API

Отредактируйте `src/YouTubeTranscriptSummarizer.API/appsettings.json`:

### OpenAI (рекомендуется)
```json
{
  "OpenAI": {
    "ApiKey": "your-openai-api-key-here",
    "Model": "gpt-3.5-turbo"
  }
}
```

### Локальный LLM (Ollama)
```json
{
  "LocalLLM": {
    "Model": "llama2"
  }
}
```

## 🆕 Новые возможности Angular 19

- ✅ Улучшенная производительность
- ✅ Новые возможности в шаблонах (@if, @for)
- ✅ RxJS 8 с новыми операторами
- ✅ Улучшенная типизация TypeScript 5.6
- ✅ Современные standalone компоненты
- ✅ Новый application builder

## 🐛 Устранение проблем

### Ошибка "node не найден"
- Перезапустите PowerShell
- Проверьте переменную PATH
- Переустановите Node.js

### Ошибка npm
```powershell
npm cache clean --force
npm install -g npm@latest
```

### Проблемы с Angular CLI
```powershell
npm uninstall -g @angular/cli
npm install -g @angular/cli@19
```

### Ошибки сборки
```powershell
cd client
npm install
ng build
```

## 📦 Зависимости проекта

### Angular 19
- @angular/core: ^19.0.0
- @angular/common: ^19.0.0
- @angular/router: ^19.0.0
- @angular/forms: ^19.0.0

### RxJS 8
- rxjs: ~8.0.0

### TypeScript 5.6
- typescript: ~5.6.0

## 🧪 Тестирование

```powershell
# Backend тесты
dotnet test src/YouTubeTranscriptSummarizer.API.Tests

# Frontend тесты
cd client
ng test

# E2E тесты
ng e2e
``` 