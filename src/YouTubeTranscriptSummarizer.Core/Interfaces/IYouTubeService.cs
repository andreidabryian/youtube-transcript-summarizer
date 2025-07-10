using YouTubeTranscriptSummarizer.Core.Models;

namespace YouTubeTranscriptSummarizer.Core.Interfaces;

public interface IYouTubeService
{
    Task<VideoInfo> GetVideoInfoAsync(string videoUrl);
    Task<VideoTranscript> GetTranscriptAsync(string videoUrl);
    Task<bool> HasTranscriptAsync(string videoUrl);
} 