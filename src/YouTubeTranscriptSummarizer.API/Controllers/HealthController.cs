using Microsoft.AspNetCore.Mvc;

namespace YouTubeTranscriptSummarizer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { status = "Healthy" });
    }
} 