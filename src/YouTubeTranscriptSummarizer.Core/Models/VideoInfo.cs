namespace YouTubeTranscriptSummarizer.Core.Models;

public class VideoInfo
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public DateTime UploadDate { get; set; }
    public long ViewCount { get; set; }
}

public class TranscriptSegment
{
    public TimeSpan Start { get; set; }
    public TimeSpan End { get; set; }
    public string Text { get; set; } = string.Empty;
}

public class VideoTranscript
{
    public VideoInfo VideoInfo { get; set; } = new();
    public List<TranscriptSegment> Segments { get; set; } = new();
    public string FullText => string.Join(" ", Segments.Select(s => s.Text));
}

public class VideoSummary
{
    public VideoInfo VideoInfo { get; set; } = new();
    public List<string> SummaryPoints { get; set; } = new();
    public string FullSummary { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
} 