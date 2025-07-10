# Multi-stage build for production
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src

# Copy backend project files
COPY src/YouTubeTranscriptSummarizer.Core/ ./YouTubeTranscriptSummarizer.Core/
COPY src/YouTubeTranscriptSummarizer.Services/ ./YouTubeTranscriptSummarizer.Services/
COPY src/YouTubeTranscriptSummarizer.API/ ./YouTubeTranscriptSummarizer.API/
COPY YouTubeTranscriptSummarizer.sln ./

# Restore and build backend
RUN dotnet restore
RUN dotnet build --no-restore --configuration Release
RUN dotnet publish YouTubeTranscriptSummarizer.API --no-restore --configuration Release --output /app/backend

# Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy frontend files
COPY client/package*.json ./
RUN npm ci --only=production

COPY client/ ./
RUN npm run build

# Production stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install nginx for serving frontend
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY --from=backend-build /app/backend ./

# Copy frontend
COPY --from=frontend-build /app/dist/youtube-transcript-summarizer-client /var/www/html

# Configure nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 80 443 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start both backend and frontend
CMD ["/start.sh"] 