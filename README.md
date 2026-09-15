# Token & CO₂ Dashboard — website

The central documentation site for the neuland Token & CO₂ Dashboard, published on GitHub
Pages at <https://neuland.github.io/tokendashboard-landingpage/>. It explains how the five repositories
fit together, walks through the dashboard with screenshots, documents the concepts behind
the numbers, and records the domain decisions behind them — how things are calculated, what
is left out, what is stored — and why.

The individual repositories keep their own READMEs and decision records; this site links
to them rather than duplicating them.

| Repository | What it is |
|---|---|
| [tokendashboard-frontend](https://github.com/neuland/tokendashboard-frontend) | The dashboard (Astro + React) |
| [tokendashboard-backend](https://github.com/neuland/tokendashboard-backend) | Ingest, pricing, CO₂ estimation, aggregation (Kotlin/Ktor + Postgres) |
| [tokendashboard-plugin-claude](https://github.com/neuland/tokendashboard-plugin-claude) | Claude Code hook plugin |
| [tokendashboard-plugin-copilot](https://github.com/neuland/tokendashboard-plugin-copilot) | GitHub Copilot CLI hook plugin |
| [tokendashboard-plugin-opencode](https://github.com/neuland/tokendashboard-plugin-opencode) | OpenCode plugin |

## Development

Requires Node.js ≥ 24 (see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321/tokendashboard-landingpage/
npm run build     # static site into dist/
npm run preview   # serve dist/ locally
npm run check     # astro check (type-checks .astro files)
```

The site is a plain [Astro](https://astro.build/) project with no framework islands: everything is
static HTML and CSS. Fonts (Inter, JetBrains Mono for code) are bundled under
`src/assets/fonts/` and loaded through the [Astro Fonts API](https://docs.astro.build/en/guides/fonts/)
with the `local` provider (see `astro.config.mjs`), which generates the `@font-face` rules,
preload links and size-matched fallbacks. Both fonts are licensed under the SIL Open Font
License 1.1; the licence files sit next to the font files.

## Design

The site has its own small design system (`src/styles/tokens.css`): white ground, one sans
(Inter), a light grey band for alternating sections, soft shadows on cards and screenshots,
teal as the single accent — plain and close in spirit to
[micro-frontends.org/tractor-store](https://micro-frontends.org/tractor-store/). It is deliberately
*not* the neuland design system the dashboard frontend uses; only the logo's provider colours are
shared.

## Project structure

```
src/
├── components/   Screenshot, RepoCard, DecisionCard, ArchitectureDiagram
├── layouts/      Layout.astro – page shell, header, footer, meta tags
├── lib/          site.ts (names, links), repos.ts (repository catalogue), decisions.ts (source, areas)
├── content.config.ts   loader that reads the backend's decision log at build time
├── pages/        index.astro, decisions/index.astro, decisions/[slug].astro
└── styles/       tokens.css (design tokens), global.css
public/
├── images/       logo-mark.svg/.jpg, logo.svg/.jpg, social-card.svg/.jpg
└── screenshots/  PNGs used on the start page
```

## Decisions

The decisions section is **generated at build time from the backend repository's decision
log**, `docs/decisions.md` on the `main` branch of
[neuland/tokendashboard-backend](https://github.com/neuland/tokendashboard-backend). Nothing is
duplicated here: a decision appears on the site once it is in that log, with the log's own
text. The loader lives in `src/content.config.ts`; it splits the log at its `## N. Title`
headings, takes the first paragraph as the card summary, and assigns each entry to one of the
areas Calculation, Privacy or Architecture (`src/lib/decisions.ts` — by number for the
existing entries, by title keywords for new ones; adjust the table there if a new entry lands
in the wrong area).

To preview a log that is not on `main` yet, point the build at a local file:

```bash
DECISIONS_SOURCE=../tokendashboard-backend/docs/decisions.md npm run dev
```

The build fails if the log cannot be loaded, so a network problem never publishes an empty
decisions section.

## Screenshots

The screenshots under `public/screenshots/` are taken from the real frontend running against
a **synthetic mock backend**, not from a production deployment — the site is public, and real
company usage figures are not. To refresh them after a frontend change, run the frontend
locally against a stub of the `/api/usage/*` endpoints and capture with Playwright at a
1280 px viewport and 2× device scale; the statusline image is an illustrative rendering of the
plugin's real output format.

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds the site with `withastro/action` and publishes it with `actions/deploy-pages`. In the
repository settings, *Pages → Source* must be set to **GitHub Actions** once.

The site is configured for `https://neuland.github.io/tokendashboard-landingpage/`. A fork under another
name builds with

```bash
SITE_URL=https://<owner>.github.io SITE_BASE=/<repo>/ npm run build
```

(see `astro.config.mjs`). Add the two variables as `env:` on the build step of the workflow.

## License

MIT — see [LICENSE](LICENSE). Screenshots and the logo are part of this repository and
covered by the same licence.
