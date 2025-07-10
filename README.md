# YouTube Transcript Summarizer

An application for extracting YouTube video transcripts and generating concise AI-powered summaries.

## 🚀 Features

- **YouTube transcript extraction** via YoutubeExplode
- **AI summarization**: concise summary (3-10 points) using LLM (OpenAI or local LLM)
- **Automatic fallback**: if OpenAI is unavailable, local LLM (Ollama) is used
- **Modern UI**: responsive Angular 19 frontend with latest features
- **REST API**: .NET 9, production-ready
- **Health-check endpoint**: `/api/health`
- **Unit/integration tests** for backend and frontend

## 🛠️ Tech Stack

- **Backend**: .NET 9, YoutubeExplode 6.5+, OpenAI API, Ollama (local LLM)
- **Frontend**: Angular 19, RxJS 8, TypeScript 5.6+, modern standalone components
- **Testing**: xUnit, Angular TestBed

## 📋 Requirements

- .NET 9 SDK
- Node.js 18+ and npm
- Angular CLI 19+
- OpenAI API key (optional)
- Ollama (optional, for local LLM)

## 🏁 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd YouTubeTranscriptSummarizer
```

### 2. Backend setup

```bash
cd src/YouTubeTranscriptSummarizer.API
dotnet restore
dotnet run
```

### 3. Frontend setup

```bash
cd client
npm install
ng serve
```

### 4. Health Check

```bash
curl http://localhost:7001/api/health
# Response: { "status": "Healthy" }
```

## ⚙️ Configuration

Edit `src/YouTubeTranscriptSummarizer.API/appsettings.json`:

### OpenAI (recommended)

```json
{
  "OpenAI": {
    "ApiKey": "your-openai-api-key-here",
    "Model": "gpt-3.5-turbo"
  }
}
```

### Local LLM (Ollama)

1. Install Ollama: https://ollama.ai/
2. Download a model:
```bash
ollama pull llama2
```
3. Configure:
```json
{
  "LocalLLM": {
    "Model": "llama2"
  }
}
```

If OpenAI is unavailable, local LLM (Ollama) will be used automatically.

## 🧪 Testing

- Run backend tests: `dotnet test src/YouTubeTranscriptSummarizer.API.Tests`
- Run frontend tests: `ng test` (from `client` directory)
---
