using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Endpoints;

namespace Portfolio.Tests;

public class PublicSiteEndpointTests : IAsyncLifetime
{
    private readonly PostgresApiFactory _factory = new();

    public Task InitializeAsync() => _factory.InitializeAsync();

    public Task DisposeAsync() => ((IAsyncLifetime)_factory).DisposeAsync();

    [Fact]
    public async Task Returns_the_seeded_site_in_order()
    {
        var site = await _factory.CreateClient().GetFromJsonAsync<SiteDto>("/api/public/site");

        Assert.NotNull(site);
        Assert.Equal("Leyla Mammadova", site.Name);
        Assert.Equal(["dayanak", "matrink", "proofpay"], site.Projects.Select(p => p.Slug));
        Assert.Equal(["LinkedIn", "GitHub", "Instagram"], site.Socials.Select(s => s.Label));
        Assert.Equal(3, site.Projects[0].Details?.Results.Count);
        Assert.Equal("2022 — now", site.Experience[^1].Period);
    }

    [Fact]
    public async Task Leaves_out_empty_optional_fields()
    {
        var json = await _factory.CreateClient().GetFromJsonAsync<JsonObject>("/api/public/site");

        var proofpay = json!["projects"]!.AsArray().Single(p => (string?)p!["slug"] == "proofpay")!.AsObject();
        Assert.False(proofpay.ContainsKey("details"));
        Assert.False(proofpay.ContainsKey("highlight"));
        Assert.Equal("In progress · Results pending", (string?)proofpay["status"]);
    }

    [Fact]
    public async Task Hides_trashed_items()
    {
        await _factory.WithDbAsync(async db =>
        {
            var matrink = await db.Projects.SingleAsync(p => p.Slug == "matrink");
            matrink.DeletedAt = DateTimeOffset.UtcNow;
            await db.SaveChangesAsync();
        });

        var site = await _factory.CreateClient().GetFromJsonAsync<SiteDto>("/api/public/site");

        Assert.Equal(["dayanak", "proofpay"], site!.Projects.Select(p => p.Slug));
    }

    [Fact]
    public async Task Seeding_again_keeps_edits()
    {
        await _factory.WithDbAsync(async db =>
        {
            (await db.SiteProfiles.SingleAsync()).Name = "Leyla M.";
            await db.SaveChangesAsync();
            await db.Database.MigrateAsync();
        });

        var site = await _factory.CreateClient().GetFromJsonAsync<SiteDto>("/api/public/site");

        Assert.Equal("Leyla M.", site!.Name);
        Assert.Equal(3, site.Projects.Count);
    }

    [Fact]
    public async Task Returns_404_before_content_is_set_up()
    {
        await _factory.WithDbAsync(db => db.SiteProfiles.ExecuteDeleteAsync());

        var response = await _factory.CreateClient().GetAsync("/api/public/site");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
