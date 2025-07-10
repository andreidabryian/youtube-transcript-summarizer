using YouTubeTranscriptSummarizer.Core.Models;

namespace YouTubeTranscriptSummarizer.Core.Interfaces;

public interface ISummarizationService
{
    Task<VideoSummary> SummarizeAsync(VideoTranscript transcript, int maxPoints = 5);
    Task<string> GenerateSummaryAsync(string text, int maxPoints = 5);
} 