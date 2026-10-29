# Security

## Reporting a vulnerability

Please email **info@leylammdva.com** with the details and steps to reproduce, or use GitHub's private vulnerability reporting for this repository. Do not open a public issue for a security problem. You will get a reply within a few days.

## How the project is set up

- **Site:** fully static files on Vercel; no server code runs for visitors. Every response carries a strict Content-Security-Policy (inline scripts allowed only by hash), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` and `Permissions-Policy`. See `web/scripts/vercel-output.mjs`.
- **API:** read-only public endpoint on Render, running as a non-root user. Security headers, no `Server` header, problem responses without internals, a per-client rate limit and a short output cache. See `api/src/Portfolio.Api/Http/Hardening.cs`.
- **Secrets:** the database connection string lives only in Render's environment variables; nothing secret is committed. GitHub secret scanning and push protection are on.
- **Dependencies:** versions are pinned and Dependabot proposes updates weekly. CI actions are pinned to commit SHAs and the workflow token is read-only.
