---
name: verify
description: Build, run and visually verify the todays-lunch Next.js app
---

# Verifying todays-lunch

Next.js 16 app, home page is `force-dynamic` and scrapes 10 real restaurant sites server-side (cards stream in via Suspense, allow ~5s for full HTML).

## Build & run

```bash
npm run build            # turbopack, ~30s incl. typecheck
npm start                # production server on :3000
```

Check port 3000 first — the user often has `npm run dev` running there already (it hot-reloads, so verifying against it is fine; a devtools "N" badge appears bottom-left in screenshots).

## Drive it (headless browser)

No Playwright in the repo. Install into the scratchpad:

```bash
npm init -y && npm install playwright-core
npx playwright-core install chromium-headless-shell   # ~100MB, cached in ~/.cache/ms-playwright
```

Then drive `http://localhost:3000` with `playwright-core`'s chromium. Flows worth exercising:

- Search input `#lunch-search` (300ms debounce) — a Swedish food word like "lax" matches weekly menus and auto-opens them with accent highlights; garbage input hides all entries.
- `button:has-text("FULL WEEK")` toggles the weekly menu panel.
- `button:has-text("RANDOMIZE")` — ~2s slot spin, then winner overlay (auto-dismisses after 4.5s), losers dim to opacity .25, "undo" resets.
- `button:has-text("MAP")` opens the Google Maps dialog; Escape closes.
- `button:has-text("VIEW MENU IMAGE")` (Blå dörren) opens the menu-image dialog.
- Theme toggle `button:has-text("EDITION")` flips light/dark (next-themes, class attribute).

## Gotchas

- Menu content depends on live scrapes: some restaurants legitimately show "No menu at press time" (weekends, summer breaks), and totals like "5 DAYS · 0 DISHES" can be real data, not bugs.
- Remote menu images must have their host allowed in `next.config.ts` `images.remotePatterns`.
