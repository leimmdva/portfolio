using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PortfolioDbContext>(options => options
    .UseNpgsql(builder.Configuration.GetConnectionString("Portfolio"))
    .UseSeeding((db, _) => ContentSeeder.Seed(db))
    .UseAsyncSeeding((db, _, ct) => ContentSeeder.SeedAsync(db, ct)));

var app = builder.Build();

// On Render the database is migrated (and seeded the first time) when the API starts.
if (app.Configuration.GetValue<bool>("Database:MigrateOnStartup"))
{
    await using var scope = app.Services.CreateAsyncScope();
    await scope.ServiceProvider.GetRequiredService<PortfolioDbContext>().Database.MigrateAsync();
}

// Render pings this to decide whether a deploy is healthy.
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();

// Exposes the entry point to WebApplicationFactory in the test project.
public partial class Program;
