using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;
using YouTubeTranscriptSummarizer.Core.Interfaces;
using YouTubeTranscriptSummarizer.Core.Models;

namespace YouTubeTranscriptSummarizer.Services.Services;

public class OpenAISummarizationService : ISummarizationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OpenAISummarizationService> _logger;
    private readonly string _apiKey;
    private readonly string _model;

    public OpenAISummarizationService(
        HttpClient httpClient, 
        ILogger<OpenAISummarizationService> logger,
        string apiKey,
        string model = "gpt-3.5-turbo")
    {
        _httpClient = httpClient;
        _logger = logger;
        _apiKey = apiKey;
        _model = model;
        
        _httpClient.BaseAddress = new Uri("https://api.openai.com/v1/");
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
    }

    public async Task<VideoSummary> SummarizeAsync(VideoTranscript transcript, int maxPoints = 5)
    {
        try
        {
            var summaryText = await GenerateSummaryAsync(transcript.FullText, maxPoints);
            var summaryPoints = ExtractSummaryPoints(summaryText);

            return new VideoSummary
            {
                VideoInfo = transcript.VideoInfo,
                SummaryPoints = summaryPoints,
                FullSummary = summaryText,
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании саммари для видео: {VideoId}", transcript.VideoInfo.Id);
            throw new InvalidOperationException($"Не удалось создать саммари: {ex.Message}");
        }
    }

    public async Task<string> GenerateSummaryAsync(string text, int maxPoints = 5)
    {
        try
        {
            var prompt = CreateSummaryPrompt(text, maxPoints);
            
            var request = new
            {
                model = _model,
                messages = new[]
                {
                    new { role = "system", content = "Ты - помощник для создания кратких саммари текстов. Отвечай только на русском языке." },
                    new { role = "user", content = prompt }
                },
                max_tokens = 1000,
                temperature = 0.3
            };

            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("chat/completions", content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var responseObject = JsonSerializer.Deserialize<OpenAIResponse>(responseContent);

            return responseObject?.Choices?.FirstOrDefault()?.Message?.Content ?? "Не удалось создать саммари";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при генерации саммари");
            throw new InvalidOperationException($"Ошибка при генерации саммари: {ex.Message}");
        }
    }

    private string CreateSummaryPrompt(string text, int maxPoints)
    {
        return $@"Создай краткое саммари следующего текста в виде {maxPoints} ключевых пунктов на русском языке.

Текст:
{text}

Требования:
- Создай {maxPoints} основных пунктов
- Каждый пункт должен быть кратким и информативным
- Используй маркированный список
- Отвечай только на русском языке
- Фокусируйся на главных идеях и ключевых моментах";
    }

    private List<string> ExtractSummaryPoints(string summaryText)
    {
        var points = new List<string>();
        var lines = summaryText.Split('\n', StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var line in lines)
        {
            var trimmedLine = line.Trim();
            if (trimmedLine.StartsWith("-") || trimmedLine.StartsWith("•") || trimmedLine.StartsWith("*"))
            {
                points.Add(trimmedLine.Substring(1).Trim());
            }
            else if (trimmedLine.Any(char.IsDigit) && trimmedLine.Contains("."))
            {
                var parts = trimmedLine.Split('.', 2);
                if (parts.Length > 1)
                {
                    points.Add(parts[1].Trim());
                }
            }
        }

        return points.Any() ? points : new List<string> { summaryText };
    }

    private class OpenAIResponse
    {
        public List<Choice>? Choices { get; set; }
    }

    private class Choice
    {
        public Message? Message { get; set; }
    }

    private class Message
    {
        public string? Content { get; set; }
    }
} 