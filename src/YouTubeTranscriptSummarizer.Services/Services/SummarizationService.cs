using Microsoft.Extensions.Logging;
using YouTubeTranscriptSummarizer.Core.Interfaces;
using YouTubeTranscriptSummarizer.Core.Models;

namespace YouTubeTranscriptSummarizer.Services.Services;

public class SummarizationService : ISummarizationService
{
    private readonly ISummarizationService _openAiService;
    private readonly ISummarizationService _localLlmService;
    private readonly ILogger<SummarizationService> _logger;

    public SummarizationService(
        ISummarizationService openAiService,
        ISummarizationService localLlmService,
        ILogger<SummarizationService> logger)
    {
        _openAiService = openAiService;
        _localLlmService = localLlmService;
        _logger = logger;
    }

    public async Task<VideoSummary> SummarizeAsync(VideoTranscript transcript, int maxPoints = 5)
    {
        try
        {
            return await _openAiService.SummarizeAsync(transcript, maxPoints);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "OpenAI summarization failed, falling back to local LLM");
            return await _localLlmService.SummarizeAsync(transcript, maxPoints);
        }
    }

    public async Task<string> GenerateSummaryAsync(string text, int maxPoints = 5)
    {
        try
        {
            return await _openAiService.GenerateSummaryAsync(text, maxPoints);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "OpenAI summary generation failed, falling back to local LLM");
            return await _localLlmService.GenerateSummaryAsync(text, maxPoints);
        }
    }
} 