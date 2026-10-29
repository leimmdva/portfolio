using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Portfolio.Api.Data;

namespace Portfolio.Tests;

/// <summary>
/// Runs the API against its own throwaway PostgreSQL database, migrated and seeded on startup.
/// Set TEST_POSTGRES to point at another server; CI uses a postgres service container.
/// </summary>
public sealed class PostgresApiFactory(IReadOnlyDictionary<string, string?>? settings = null)
    : WebApplicationFactory<Program>, IAsyncLifetime
{
    private static readonly string PostgresServer =
        Environment.GetEnvironmentVariable("TEST_POSTGRES") ?? "Host=localhost;Username=postgres;Password=postgres";

    private readonly string _database = $"portfolio_test_{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration(config => config.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:Portfolio"] = $"{PostgresServer};Database={_database}",
            ["Database:MigrateOnStartup"] = "true",
        }).AddInMemoryCollection(settings ?? new Dictionary<string, string?>()));
    }

    /// <summary>Runs <paramref name="action"/> with a fresh DbContext from the app's services.</summary>
    public async Task WithDbAsync(Func<PortfolioDbContext, Task> action)
    {
        await using var scope = Services.CreateAsyncScope();
        await action(scope.ServiceProvider.GetRequiredService<PortfolioDbContext>());
    }

    public Task InitializeAsync() => Task.CompletedTask;

    async Task IAsyncLifetime.DisposeAsync()
    {
        await DisposeAsync();
        NpgsqlConnection.ClearAllPools();
        await using var conn = new NpgsqlConnection($"{PostgresServer};Database=postgres");
        await conn.OpenAsync();
        await using var cmd = new NpgsqlCommand($"DROP DATABASE IF EXISTS \"{_database}\" WITH (FORCE)", conn);
        await cmd.ExecuteNonQueryAsync();
    }
}
