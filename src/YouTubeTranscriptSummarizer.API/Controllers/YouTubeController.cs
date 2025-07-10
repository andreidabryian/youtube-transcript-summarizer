using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using YouTubeTranscriptSummarizer.Core.Interfaces;
using YouTubeTranscriptSummarizer.Core.Models;

namespace YouTubeTranscriptSummarizer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class YouTubeController : ControllerBase
{
    private readonly IYouTubeService _youtubeService;
    private readonly ISummarizationService _summarizationService;
    private readonly ILogger<YouTubeController> _logger;

    public YouTubeController(
        IYouTubeService youtubeService,
        ISummarizationService summarizationService,
        ILogger<YouTubeController> logger)
    {
        _youtubeService = youtubeService;
        _summarizationService = summarizationService;
        _logger = logger;
    }

    [HttpGet("info")]
    public async Task<ActionResult<VideoInfo>> GetVideoInfo([FromQuery] string videoUrl)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(videoUrl))
            {
                return BadRequest("URL видео обязателен");
            }

            var videoInfo = await _youtubeService.GetVideoInfoAsync(videoUrl);
            return Ok(videoInfo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении информации о видео: {VideoUrl}", videoUrl);
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("transcript")]
    public async Task<ActionResult<VideoTranscript>> GetTranscript([FromQuery] string videoUrl)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(videoUrl))
            {
                return BadRequest("URL видео обязателен");
            }

            var hasTranscript = await _youtubeService.HasTranscriptAsync(videoUrl);
            if (!hasTranscript)
            {
                return BadRequest("Транскрипция недоступна для данного видео");
            }

            var transcript = await _youtubeService.GetTranscriptAsync(videoUrl);
            return Ok(transcript);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении транскрипции: {VideoUrl}", videoUrl);
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("summary")]
    public async Task<ActionResult<VideoSummary>> GetSummary(
        [FromQuery] string videoUrl,
        [FromQuery] int maxPoints = 5)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(videoUrl))
            {
                return BadRequest("URL видео обязателен");
            }

            if (maxPoints < 1 || maxPoints > 10)
            {
                return BadRequest("Количество пунктов должно быть от 1 до 10");
            }

            var hasTranscript = await _youtubeService.HasTranscriptAsync(videoUrl);
            if (!hasTranscript)
            {
                return BadRequest("Транскрипция недоступна для данного видео");
            }

            var transcript = await _youtubeService.GetTranscriptAsync(videoUrl);
            var summary = await _summarizationService.SummarizeAsync(transcript, maxPoints);

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании саммари: {VideoUrl}", videoUrl);
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("summary")]
    public async Task<ActionResult<VideoSummary>> CreateSummary(
        [FromBody] CreateSummaryRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.VideoUrl))
            {
                return BadRequest("URL видео обязателен");
            }

            if (request.MaxPoints < 1 || request.MaxPoints > 10)
            {
                return BadRequest("Количество пунктов должно быть от 1 до 10");
            }

            var hasTranscript = await _youtubeService.HasTranscriptAsync(request.VideoUrl);
            if (!hasTranscript)
            {
                return BadRequest("Транскрипция недоступна для данного видео");
            }

            var transcript = await _youtubeService.GetTranscriptAsync(request.VideoUrl);
            var summary = await _summarizationService.SummarizeAsync(transcript, request.MaxPoints);

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании саммари: {VideoUrl}", request.VideoUrl);
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("check-transcript")]
    public async Task<ActionResult<bool>> CheckTranscript([FromQuery] string videoUrl)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(videoUrl))
            {
                return BadRequest("URL видео обязателен");
            }

            var hasTranscript = await _youtubeService.HasTranscriptAsync(videoUrl);
            return Ok(hasTranscript);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при проверке транскрипции: {VideoUrl}", videoUrl);
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public class CreateSummaryRequest
{
    [Required(ErrorMessage = "URL видео обязателен")]
    public string VideoUrl { get; set; } = string.Empty;
    
    [Range(1, 10, ErrorMessage = "Количество пунктов должно быть от 1 до 10")]
    public int MaxPoints { get; set; } = 5;
} 