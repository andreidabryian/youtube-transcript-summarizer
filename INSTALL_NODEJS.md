# Установка Node.js для Windows

## 🚀 Быстрая установка

### Вариант 1: Через официальный сайт (рекомендуется)

1. **Скачайте Node.js** с официального сайта: https://nodejs.org/
2. **Выберите LTS версию** (Long Term Support) - стабильная версия
3. **Запустите установщик** и следуйте инструкциям
4. **Перезапустите PowerShell** после установки

### Вариант 2: Через Chocolatey (если установлен)

```powershell
choco install nodejs
```

### Вариант 3: Через winget (Windows 10/11)

```powershell
winget install OpenJS.NodeJS
```

## ✅ Проверка установки

После установки выполните в PowerShell:

```powershell
node --version
npm --version
```

Должны отобразиться версии Node.js и npm.

## 🎯 Установка Angular CLI

После установки Node.js установите Angular CLI:

```powershell
npm install -g @angular/cli
```

## 🚀 Запуск приложения

После установки Node.js:

1. **Запустите PowerShell скрипт:**
   ```powershell
   .\start.ps1
   ```

2. **Или запустите вручную:**

   **Backend (в одном терминале):**
   ```powershell
   cd src\YouTubeTranscriptSummarizer.API
   dotnet run
   ```

   **Frontend (в другом терминале):**
   ```powershell
   cd client
   npm install
   ng serve
   ```

## 🌐 Доступные адреса

- **Frontend**: http://localhost:4200
- **Backend API**: https://localhost:7001
- **Swagger UI**: https://localhost:7001/swagger

## ⚠️ Важные замечания

1. **Перезапустите PowerShell** после установки Node.js
2. **Настройте API ключи** в `src/YouTubeTranscriptSummarizer.API/appsettings.json`
3. **Убедитесь, что порты 4200 и 7001 свободны**

## 🐛 Устранение проблем

### Ошибка "node не найден"
- Перезапустите PowerShell
- Проверьте переменную PATH
- Переустановите Node.js

### Ошибка npm
- Убедитесь, что npm установлен вместе с Node.js
- Попробуйте `npm cache clean --force`

### Проблемы с Angular CLI
- Удалите и переустановите: `npm uninstall -g @angular/cli && npm install -g @angular/cli` 