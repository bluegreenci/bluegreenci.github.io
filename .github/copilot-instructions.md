# Copilot instructions (Runbook blog)

## What this folder is
- `blog/` is an Astro 5 site (a customized `astro-erudite` theme) with MDX content, KaTeX math, and optional newsletter/comments/analytics integrations.

## Dev workflow
- `cd blog && npm install && npm run dev`
- Build: `npm run build` (runs `astro check` + `astro build`)

## Where things live
- Site constants/config: `blog/src/consts.ts`.
- Content: `blog/content/` (projects) and `blog/src/content/blog/` (posts).
- Serverless bits: `blog/functions/api/`.

## Guardrails
- Don’t commit real API keys (Brevo/Disqus/Analytics). Use `.env.example` as the template.
