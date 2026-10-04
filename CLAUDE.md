# Lunchbladet — notes for agents

Next.js 16.3 App Router app that scrapes Södermalm restaurant lunch menus server-side. See README.md for the architecture overview and the "Adding a restaurant" steps. Version-matched Next.js docs are bundled in `node_modules/next/dist/docs/`; prefer them over memory.

## Verify changes

- `npm run typecheck` (TS 7), `npm run lint`, `npm run build`. Use the `/verify` skill to run the app and drive it in a headless browser.
- To test one scraper against the live site without the app, run a throwaway script with tsx (top-level await is not supported, wrap in an async IIFE):
  ```ts
  // src/__try.ts — delete afterwards
  import { Kvarnen } from "@/lib/restaurant/kvarnen";
  (async () => { const r = new Kvarnen(); await r.update(); console.log(r.didError, r.menu, r.weeklyMenu); })();
  ```
  `npx tsx --tsconfig tsconfig.json src/__try.ts`
- Menus are live data: an empty menu on a weekend or holiday can be real, not a bug.

## Scraper conventions

- Fetch only via `this.fetchText()` / `this.fetchBuffer()` (shared headers, throws on non-OK). Don't add `next: { revalidate }` options; caching is done once, in `menu-cache.ts`.
- Build every dish with `formatDish()` from `src/lib/dish.ts`; `DishList` parses that exact format back. Don't hand-assemble `"LABEL: …"` strings.
- Per-day dishes go in the returned `DailyMenu` (English weekday keys); dishes served all week go in `this._weeklyMenu`. Never copy a weekly menu into all five days.
- Throw when nothing was parsed, so the card shows an error rather than "no menu".
- Sites change without notice. When a scraper breaks, fetch the live page first and check what actually came back (redesign, 404, bot challenge) before changing parsing.
- Kvartersmenyn (`*.kvartersmenyn.se`) is behind Cloudflare and serves a bot challenge to cloud hosts. Big Ben reads the same page from the `*.korttelimenu.com` mirror instead.

## Cache Components

`cacheComponents` is on. In server components, reading the clock or randomness (`new Date()`, `Date.now()`, `Math.random()`, `Restaurant.todayEn()`) must come after `await connection()` inside a `<Suspense>` boundary, or the build fails. Cached data must be plain serializable values, never `Restaurant` instances.

## UI

- Follow the "Lunchbladet" design in `design/` and the tokens in `globals.css`. Radius 0, no shadows, hairline rules.
- UI copy in English, newspaper voice; only the title "Lunchbladet" is Swedish.
- Use the components in `src/lib/typography/Typography.tsx` for text, not inline font classes.
- Buttons and button-styled links: `<Button variant="ink|outline|pill|kicker">` from `src/components/ui/button.tsx` (shadcn, restyled). Use `asChild` for `<a>`. Don't hand-style new buttons. Add shadcn components with `npx shadcn@latest add …`, then point their `cn` import at `@/lib/utils` and restyle to the design.

## Tooling gotchas

- `typescript` is aliased to the TS 6 compatibility package for typescript-eslint; `tsc` is TS 7. Don't "fix" the alias.
- Line endings are LF (`.gitattributes`). Reformat-only commits go in `.git-blame-ignore-revs`.
