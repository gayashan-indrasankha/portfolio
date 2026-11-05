# Gayashan Indrasankha — Portfolio

Personal portfolio built with React, TypeScript and Vite. Each flagship project is shown as a
scroll-driven "how it runs" diagram, and every project has its own case-file page at `/work/<slug>`.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/`; `npm run preview` serves the build.

## Editing content

All content is data, so you rarely need to touch components:

| What | Where |
| --- | --- |
| Name, pitch, status, links, résumé, portrait | `src/data/profile.ts` (`profile`) |
| About text and focus list | `src/data/profile.ts` (`about`) |
| Experience timeline | `src/data/profile.ts` (`timeline`) |
| Stack groups | `src/data/profile.ts` (`stack`) |
| Certificates and awards (hidden while empty) | `src/data/profile.ts` |
| Projects, diagram steps, stats, case-file chapters | `src/data/projects.ts` |
| Colours, fonts, spacing | `src/styles/tokens.css` |

- Set `flagship: true` on a project to give it a scroll-driven diagram on the home page. Give it
  5–9 `steps`, with each `label` short enough to fit in a diagram node (about 14 characters).
- Case-file screenshots go in `public/work/<slug>/` and are referenced from a chapter's `figure.src`.
- Lines marked `TODO` need details only you know (dates, your role in team projects, portrait, résumé).

## Structure

```
src/
  data/        profile.ts, projects.ts — all site content
  components/  Nav, Hero, About, Work, Flagship, Pipeline, Experience, Stack, Recognition, Contact, Footer
  pages/       Home, CaseFile, NotFound
  styles/      tokens.css (design tokens), base.css, sections.css, casefile.css
```

## Deploy

Deploys to Vercel as a static Vite site. `vercel.json` rewrites routes such as `/work/grc-risk-monitor`
to `index.html` so deep links work.
