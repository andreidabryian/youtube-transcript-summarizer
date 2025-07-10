using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace YouTubeTranscriptSummarizer.API.Tests;

public class YouTubeControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public YouTubeControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetVideoInfo_ReturnsBadRequest_WhenUrlMissing()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/info");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetVideoInfo_ReturnsBadRequest_WhenUrlEmpty()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/info?videoUrl=");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetVideoInfo_ReturnsBadRequest_WhenUrlWhitespace()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/info?videoUrl=%20");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTranscript_ReturnsBadRequest_WhenUrlMissing()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/transcript");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTranscript_ReturnsBadRequest_WhenUrlEmpty()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/transcript?videoUrl=");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSummary_Get_ReturnsBadRequest_WhenUrlMissing()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/summary");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSummary_Get_ReturnsBadRequest_WhenUrlEmpty()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/summary?videoUrl=");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSummary_Get_ReturnsBadRequest_WhenMaxPointsTooLow()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/summary?videoUrl=test&maxPoints=0");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSummary_Get_ReturnsBadRequest_WhenMaxPointsTooHigh()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/summary?videoUrl=test&maxPoints=11");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateSummary_Post_ReturnsBadRequest_WhenUrlMissing()
    {
        var client = _factory.CreateClient();
        var request = new { VideoUrl = "", MaxPoints = 5 };
        var response = await client.PostAsJsonAsync("/api/youtube/summary", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateSummary_Post_ReturnsBadRequest_WhenUrlNull()
    {
        var client = _factory.CreateClient();
        var request = new { VideoUrl = (string)null, MaxPoints = 5 };
        var response = await client.PostAsJsonAsync("/api/youtube/summary", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateSummary_Post_ReturnsBadRequest_WhenMaxPointsTooLow()
    {
        var client = _factory.CreateClient();
        var request = new { VideoUrl = "test", MaxPoints = 0 };
        var response = await client.PostAsJsonAsync("/api/youtube/summary", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateSummary_Post_ReturnsBadRequest_WhenMaxPointsTooHigh()
    {
        var client = _factory.CreateClient();
        var request = new { VideoUrl = "test", MaxPoints = 11 };
        var response = await client.PostAsJsonAsync("/api/youtube/summary", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CheckTranscript_ReturnsBadRequest_WhenUrlMissing()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/check-transcript");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CheckTranscript_ReturnsBadRequest_WhenUrlEmpty()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/check-transcript?videoUrl=");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSummary_Get_UsesDefaultMaxPoints()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/youtube/summary?videoUrl=test");
        // Should not return BadRequest for maxPoints validation since default is 5
        Assert.NotEqual(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateSummary_Post_UsesDefaultMaxPoints()
    {
        var client = _factory.CreateClient();
        var request = new { VideoUrl = "test" }; // MaxPoints defaults to 5
        var response = await client.PostAsJsonAsync("/api/youtube/summary", request);
        // Should not return BadRequest for maxPoints validation since default is 5
        Assert.NotEqual(HttpStatusCode.BadRequest, response.StatusCode);
    }
} 