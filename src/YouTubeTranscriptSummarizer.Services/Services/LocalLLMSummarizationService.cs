using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;
using YouTubeTranscriptSummarizer.Core.Interfaces;
using YouTubeTranscriptSummarizer.Core.Models;

namespace YouTubeTranscriptSummarizer.Services.Services;

public class LocalLLMSummarizationService : ISummarizationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<LocalLLMSummarizationService> _logger;
    private readonly string _model;

    public LocalLLMSummarizationService(
        HttpClient httpClient,
        ILogger<LocalLLMSummarizationService> logger,
        string model = "llama2")
    {
        _httpClient = httpClient;
        _logger = logger;
        _model = model;
        
        _httpClient.BaseAddress = new Uri("http://localhost:11434/");
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
                prompt = prompt,
                stream = false,
                options = new
                {
                    temperature = 0.3,
                    top_p = 0.9,
                    max_tokens = 1000
                }
            };

            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("api/generate", content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var responseObject = JsonSerializer.Deserialize<OllamaResponse>(responseContent);

            return responseObject?.Response ?? "Не удалось создать саммари";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при генерации саммари через локальный LLM");
            throw new InvalidOperationException($"Ошибка при генерации саммари: {ex.Message}");
        }
    }

    private string CreateSummaryPrompt(string text, int maxPoints)
    {
        return $@"<s>[INST] Создай краткое саммари следующего текста в виде {maxPoints} ключевых пунктов на русском языке.

Текст:
{text}

Требования:
- Создай {maxPoints} основных пунктов
- Каждый пункт должен быть кратким и информативным
- Используй маркированный список
- Отвечай только на русском языке
- Фокусируйся на главных идеях и ключевых моментах [/INST]";
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

    private class OllamaResponse
    {
        public string? Response { get; set; }
    }
} 