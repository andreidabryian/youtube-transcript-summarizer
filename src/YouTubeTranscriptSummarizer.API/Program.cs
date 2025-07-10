using YouTubeTranscriptSummarizer.Core.Interfaces;
using YouTubeTranscriptSummarizer.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure HTTP clients
builder.Services.AddHttpClient();

// Configure services
builder.Services.AddScoped<IYouTubeService, YouTubeService>();

// Register OpenAI and LocalLLM summarization services
builder.Services.AddScoped<OpenAISummarizationService>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>();
    var logger = provider.GetRequiredService<ILogger<OpenAISummarizationService>>();
    var apiKey = builder.Configuration["OpenAI:ApiKey"] ?? string.Empty;
    var model = builder.Configuration["OpenAI:Model"] ?? "gpt-3.5-turbo";
    return new OpenAISummarizationService(httpClient, logger, apiKey, model);
});
builder.Services.AddScoped<LocalLLMSummarizationService>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>();
    var logger = provider.GetRequiredService<ILogger<LocalLLMSummarizationService>>();
    var model = builder.Configuration["LocalLLM:Model"] ?? "llama2";
    return new LocalLLMSummarizationService(httpClient, logger, model);
});

// Register fallback summarization service
builder.Services.AddScoped<ISummarizationService>(provider =>
{
    var openAi = provider.GetRequiredService<OpenAISummarizationService>();
    var localLlm = provider.GetRequiredService<LocalLLMSummarizationService>();
    var logger = provider.GetRequiredService<ILogger<SummarizationService>>();
    return new SummarizationService(openAi, localLlm, logger);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run(); 