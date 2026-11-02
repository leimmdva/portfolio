using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
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
        Assert.Equal(["dayanak", "matrink", "proofpay", "bornin2"], site.Projects.Select(p => p.Slug));
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

        Assert.Equal(["dayanak", "proofpay", "bornin2"], site!.Projects.Select(p => p.Slug));
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
        Assert.Equal(4, site.Projects.Count);
    }

    [Fact]
    public async Task Migration_skips_bornin2_when_it_is_already_there()
    {
        await _factory.WithDbAsync(async db =>
        {
            // Roll back past the migration and put a project with the same slug in its place.
            await db.GetService<IMigrator>().MigrateAsync("20261029144143_InitialContent");
            await db.Database.ExecuteSqlRawAsync("""INSERT INTO "Projects" ("Slug", "Category", "Name", "Summary", "Tags", "SortOrder", "CreatedAt", "UpdatedAt") VALUES ('bornin2', 'x', 'x', 'x', ARRAY[]::text[], 9, now(), now())""");
            await db.Database.MigrateAsync();
        });

        var site = await _factory.CreateClient().GetFromJsonAsync<SiteDto>("/api/public/site");

        var bornin2 = Assert.Single(site!.Projects, p => p.Slug == "bornin2");
        Assert.Equal("x", bornin2.Name);
    }

    [Fact]
    public async Task Migration_inserts_bornin2_with_its_details()
    {
        await _factory.WithDbAsync(async db =>
        {
            await db.GetService<IMigrator>().MigrateAsync("20261029144143_InitialContent");
            await db.Database.MigrateAsync();
        });

        var site = await _factory.CreateClient().GetFromJsonAsync<SiteDto>("/api/public/site");

        Assert.Equal(["dayanak", "matrink", "proofpay", "bornin2"], site!.Projects.Select(p => p.Slug));
        var bornin2 = site.Projects[^1];
        Assert.Equal("In progress", bornin2.Status);
        Assert.Equal(["69.8 vs 70.3", "3.5% vs 3.8%", "185"], bornin2.Details!.Results.Select(r => r.Value));
        Assert.Empty(bornin2.Details.Links);
    }

    [Fact]
    public async Task Returns_404_before_content_is_set_up()
    {
        await _factory.WithDbAsync(db => db.SiteProfiles.ExecuteDeleteAsync());

        var response = await _factory.CreateClient().GetAsync("/api/public/site");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
