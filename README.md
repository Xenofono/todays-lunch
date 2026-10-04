# Lunchbladet

Today's lunch around Medborgarplatsen, Södermalm, set as a broadsheet newspaper. Menus are scraped straight from each restaurant's own site (HTML or PDF) on the server, cached, and shown side by side with search, a weekly view and a random picker.

## Getting started

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                                              |
| `npm run typecheck` | Generates route types, then type-checks with TypeScript 7 (`tsc`)   |
| `npm run lint`      | ESLint (`eslint-config-next`)                                       |
| `npm run build`     | `typecheck`, then `next build`. **Deploy with this**, not bare `next build` |
| `npm start`         | Serve the production build                                          |

CI (`.github/workflows/ci.yml`) runs lint and build on every PR.

## How it works

```
src/lib/restaurant/<name>.ts   one scraper per restaurant (extends Restaurant)
        │  update() → menu (per weekday) + weeklyMenu + additionalInformation
        ▼
src/lib/restaurant/menu-cache.ts   getMenuSnapshot(name), cached with `use cache`
        │  30 min, refreshed in the background; failed scrapes kept 1 min
        ▼
src/components/restaurant/RestaurantCard.tsx   one Suspense-streamed card per restaurant
```

- **`registry.ts`** lists every restaurant; the page shuffles them per request.
- **Daily vs weekly**: `menu` holds dishes per weekday (`monday`…`friday`); `weeklyMenu` holds dishes served all week. Restaurants with only a weekly menu return `{}` from `_getMenu()` and set `this._weeklyMenu`.
- **Dishes are strings** in one format, `LABEL: name - description (price)`, built with `formatDish()` and taken apart by `DishList` with `splitDish()` (`src/lib/dish.ts`).

## Adding a restaurant

1. Create `src/lib/restaurant/<name>.ts` extending `Restaurant`: constructor with name, menu URL, address and coordinates; implement `_getMenu()`.
2. Fetch with `this.fetchText()` / `this.fetchBuffer()` (browser headers, throws on non-OK responses). Parse HTML with cheerio, PDFs with `pdf-parse`.
3. Build dishes with `formatDish({ label, name, text, price })`; use `Restaurant.matchDayHeader()` for Swedish weekday headings and `normalizeWhitespace()` for messy text.
4. Throw if nothing was found, so the card shows an error instead of an empty menu.
5. Add the class to `RESTAURANTS` in `registry.ts`.

## TypeScript 6 and 7

`tsc` is TypeScript 7 (installed as `@typescript/native`). The `typescript` package is the TypeScript 6 compatibility build (`@typescript/typescript6`) because typescript-eslint doesn't support TS 7 yet. `next build` skips its own type check (`ignoreBuildErrors`) since `npm run build` already ran `tsc`.

## Design

The "Lunchbladet" newspaper design lives in `design/` (handoff README + HTML prototype). UI copy is English; only the masthead title is Swedish.
