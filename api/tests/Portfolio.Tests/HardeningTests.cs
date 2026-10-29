using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.Tests;

public class HardeningTests : IAsyncLifetime
{
    private readonly PostgresApiFactory _factory = new(new Dictionary<string, string?>
    {
        ["RateLimit:PermitsPerMinute"] = "3",
    });

    public Task InitializeAsync() => _factory.InitializeAsync();

    public Task DisposeAsync() => ((IAsyncLifetime)_factory).DisposeAsync();

    [Theory]
    [InlineData("/api/public/site")]
    [InlineData("/health")]
    [InlineData("/does-not-exist")]
    public async Task Sends_security_headers_and_hides_the_server(string path)
    {
        var response = await _factory.CreateClient().GetAsync(path);

        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").Single());
        Assert.Equal("default-src 'none'; frame-ancestors 'none'", response.Headers.GetValues("Content-Security-Policy").Single());
        Assert.Equal("no-referrer", response.Headers.GetValues("Referrer-Policy").Single());
        Assert.False(response.Headers.Contains("Server"));
    }

    [Fact]
    public async Task Unknown_paths_get_a_problem_without_internals()
    {
        var response = await _factory.CreateClient().GetAsync("/does-not-exist");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        var problem = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.False(problem!.ContainsKey("exception"));
    }

    [Fact]
    public async Task Limits_requests_per_client()
    {
        var client = _factory.CreateClient();
        for (var i = 0; i < 3; i++)
            Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/public/site")).StatusCode);

        Assert.Equal(HttpStatusCode.TooManyRequests, (await client.GetAsync("/api/public/site")).StatusCode);
    }

    [Fact]
    public async Task Serves_repeat_requests_from_the_cache()
    {
        var client = _factory.CreateClient();
        await client.GetAsync("/api/public/site");
        await _factory.WithDbAsync(async db =>
        {
            (await db.SiteProfiles.SingleAsync()).Name = "Changed";
            await db.SaveChangesAsync();
        });

        var site = await client.GetFromJsonAsync<JsonObject>("/api/public/site");

        Assert.Equal("Leyla Mammadova", (string?)site!["name"]);
    }
}
