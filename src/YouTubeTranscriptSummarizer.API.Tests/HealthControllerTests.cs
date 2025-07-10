using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace YouTubeTranscriptSummarizer.API.Tests;

public class HealthControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public HealthControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_ReturnsHealthyStatus()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/health");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("Healthy", content);
    }

    [Fact]
    public async Task Get_ReturnsOkStatusCode()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Get_ReturnsJsonContent()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/health");
        var contentType = response.Content.Headers.ContentType?.ToString();
        Assert.Contains("application/json", contentType);
    }

    [Fact]
    public async Task Get_ReturnsValidJsonStructure()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/health");
        var healthStatus = await response.Content.ReadFromJsonAsync<HealthStatus>();
        
        Assert.NotNull(healthStatus);
        Assert.Equal("Healthy", healthStatus.Status);
    }
}

public class HealthStatus
{
    public string Status { get; set; } = string.Empty;
} 