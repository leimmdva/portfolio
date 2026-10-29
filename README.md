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

API (.NET 10 SDK):

```bash
cd api
dotnet run --project src/Portfolio.Api   # GET /health
dotnet test Portfolio.slnx
```

## Roadmap

1. Skeleton, CI and deploy targets ← this step
2. Design tokens, fonts and the homepage (desktop + mobile)
3. Project detail dialog
4. API data model (EF Core + Neon) and the public content endpoint
5. GitHub sign-in and the dyslexia-friendly admin panel
6. Publishing flow, Turkish content, SEO and launch on leylammdva.com
