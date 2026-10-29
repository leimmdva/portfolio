# Leyla Mammadova — Portfolio v2

Personal portfolio and CV site, rebuilt from scratch. The previous React + Firebase version is kept on the `v1` branch.

- **Design:** [Figma — Portfolio v2](https://www.figma.com/design/cIMZ6So0YEgGYtnrMig5pj) (desktop 1440 px, mobile 390 px)
- **Domain:** leylammdva.com (site) · api.leylammdva.com (API)

## Structure

```
web/   React 19 + TypeScript + React Router (framework mode, pre-rendered) — public site and /admin
api/   ASP.NET Core Minimal API on .NET 10 — content, uploads, publishing
```

The public site is static: every page is pre-rendered at build time and served by Vercel. The API is only used by the admin panel and while the site builds, so visitors never wait for it.

| Part | Stack | Hosting |
| --- | --- | --- |
| Site + admin | React, React Router, Vite, CSS Modules | Vercel |
| API | ASP.NET Core, EF Core | Render (Docker) |
| Database | PostgreSQL | Neon |
| Files (CV, screenshots) | S3-compatible storage | Cloudflare R2 |

## Running locally

Web (Node 22+):

```bash
cd web
npm install
npm run dev        # http://localhost:5173
npm test
npm run build      # pre-renders to web/build/client
```

The homepage content comes from the API while the site builds. Set `CONTENT_API_URL` (for example `https://portfolio-api-j6c2.onrender.com`) to build from the API; without it, or if the API does not answer within 70 s, the build uses `web/app/content/site.ts` and logs why.

API (.NET 10 SDK and PostgreSQL 16; the quickest way to get PostgreSQL is `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`):

```bash
cd api
dotnet tool restore
dotnet ef database update --project src/Portfolio.Api   # creates the "portfolio" database and seeds the current content
dotnet run --project src/Portfolio.Api                  # GET /health, GET /api/public/site
dotnet test Portfolio.slnx                              # each test uses its own throwaway database
```

The development connection string lives in `api/src/Portfolio.Api/appsettings.Development.json`. In production it comes from the `ConnectionStrings__Portfolio` environment variable, and `Database__MigrateOnStartup=true` applies migrations when the API starts.

To change the schema, edit the entities in `Portfolio.Core/Content`, then run `dotnet ef migrations add <Name> --project src/Portfolio.Api --output-dir Data/Migrations`.

## Roadmap

1. Skeleton, CI and deploy targets ✓
2. Design tokens, fonts and the homepage (desktop + mobile) ✓
3. Project detail dialog ✓
4. API data model (EF Core + Neon) and the public content endpoint ← this step
5. GitHub sign-in and the dyslexia-friendly admin panel
6. Publishing flow, Turkish content, SEO and launch on leylammdva.com
