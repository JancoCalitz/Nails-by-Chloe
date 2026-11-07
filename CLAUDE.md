# Working agreement

See `PLAN.md` (original brief) and README "Decisions" for how this static GitHub Pages build deviates from it.

- Never invent business facts. All content lives in `content/*.json` (edited by Chloe via Sveltia CMS at `/admin/`); never hard-code prices, contact details or policies in components.
- No fake reviews, photos or badges. Placeholder images live in `public/samples/` and are labelled SAMPLE.
- Mobile-first, light pages, big tap targets. Respect `prefers-reduced-motion`.
- When changing a content shape, update `src/lib/schema.ts` AND `public/admin/config.yml` together.
- Before committing: `npm run lint && npm run typecheck && npm test && npm run build`.
- On Windows Git Bash, set `MSYS_NO_PATHCONV=1` when passing NEXT_PUBLIC_BASE_PATH.
