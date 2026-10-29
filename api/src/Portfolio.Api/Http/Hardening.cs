using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Options;

namespace Portfolio.Api.Http;

/// <summary>
/// Security defaults for a public, read-only JSON API: response headers, problem-details errors
/// without internals, the client IP from Render's proxy, and a per-IP request limit.
/// </summary>
public static class Hardening
{
    public const string PublicPolicy = "public";

    public static WebApplicationBuilder AddHardening(this WebApplicationBuilder builder)
    {
        builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false);
        builder.Services.AddProblemDetails();

        // Render's proxy appends the caller's address to X-Forwarded-For; it is the only hop we trust.
        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.ForwardLimit = 1;
            options.KnownIPNetworks.Clear();
            options.KnownProxies.Clear();
        });

        builder.Services.Configure<RateLimitSettings>(builder.Configuration.GetSection("RateLimit"));
        builder.Services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddPolicy(PublicPolicy, context => RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = context.RequestServices.GetRequiredService<IOptions<RateLimitSettings>>().Value.PermitsPerMinute,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0,
                }));
        });

        builder.Services.AddOutputCache(options =>
            options.AddPolicy(PublicPolicy, policy => policy.Expire(TimeSpan.FromSeconds(30))));

        return builder;
    }

    public static WebApplication UseHardening(this WebApplication app)
    {
        app.UseForwardedHeaders();
        app.UseExceptionHandler();
        app.UseStatusCodePages();

        app.Use(async (context, next) =>
        {
            var headers = context.Response.Headers;
            headers.XContentTypeOptions = "nosniff";
            headers.XFrameOptions = "DENY";
            headers.ContentSecurityPolicy = "default-src 'none'; frame-ancestors 'none'";
            headers["Referrer-Policy"] = "no-referrer";
            headers["Cross-Origin-Resource-Policy"] = "same-origin";
            headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
            if (!app.Environment.IsDevelopment())
                headers.StrictTransportSecurity = "max-age=63072000; includeSubDomains";
            await next();
        });

        app.UseRateLimiter();
        app.UseOutputCache();
        return app;
    }
}

/// <summary>Requests one client may make per minute to a public endpoint ("RateLimit" section).</summary>
public sealed class RateLimitSettings
{
    public int PermitsPerMinute { get; set; } = 60;
}
