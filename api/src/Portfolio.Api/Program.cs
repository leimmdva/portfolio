var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Render pings this to decide whether a deploy is healthy.
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();

// Exposes the entry point to WebApplicationFactory in the test project.
public partial class Program;
