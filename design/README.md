# Handoff: Lunchbladet — lunch-menu site redesign

## Overview
A full redesign of an existing Next.js + shadcn/ui lunch-scraper site (10 Södermalm restaurants). The new direction, "Lunchbladet", is a broadsheet-newspaper aesthetic: serif masthead, hairline column rules, warm cream paper in light mode and a plum "evening edition" dark mode. It replaces the current shadcn card grid while keeping every existing feature: today's menu, weekly menu, additional info, image-only menu fallback, no-menu notice, search, random picker (with the Pooh gif), map dialog, and the weekend-reliability warning (relocated into the masthead).

## About the Design Files
`Lunch Redesign Directions.dc.html` in this bundle is a **design reference created in HTML** — a working prototype showing intended look and behavior, NOT production code. Your task is to **recreate this design in the existing Next.js/React/Tailwind/shadcn codebase** using its established patterns (Tailwind classes driven by CSS variables in `globals.css`, jotai atoms, Suspense-per-card loading, etc.). The definitive design is **option 2a** (the topmost section of the file). Option 1a ("Neon Kantin") and the first-pass 1b are earlier explorations — ignore them except as context.

## Fidelity
**High-fidelity.** Colors, typography, spacing, borders, and interactions below are final and should be matched exactly. The dish/menu texts, addresses, and the week data in the prototype are **sample data** — the real values come from the existing scrapers (`restaurant.menuToday`, `restaurant.menu`, `restaurant.additionalInformation`, `restaurant.menuImgUrl`, `restaurant.address`, `restaurant.coordinates`).

---

## Design Tokens

### Fonts (Google Fonts)
- **Display serif:** `DM Serif Display` (weights: 400 normal + 400 italic). Used for: masthead, restaurant names, dialog titles, all italic editorial copy, search input text, randomizer value.
- **Sans:** `Archivo` (400/500/600/700). Used for: dish lines, labels, buttons, date line.
- Replace the current Geist font wiring for these surfaces. No third font.

### Light mode ("Ljus upplaga") — the default
| Token | Value | Maps to globals.css |
|---|---|---|
| Background (paper) | `#f3ead9` | `--background` |
| Ink (primary text) | `#3a2338` | `--foreground`, `--card-foreground` |
| Muted text | `#8a7488` | `--muted-foreground` |
| Accent (rust) | `#b0672a` | `--primary` / `--accent` |
| Strong rule | `rgba(58,35,56,.4)` | `--border` (strong) |
| Hairline | `rgba(58,35,56,.18)` | `--border` (subtle) — add e.g. `--hairline` |
| Hover wash / stripe fill | `rgba(58,35,56,.05)` | — |
| Ambient blob | `rgba(219,146,75,.18)` | — |
| Overlay veil | `rgba(243,234,217,.85)` | `--overlay` |

### Dark mode ("Kvällsupplaga")
| Token | Value |
|---|---|
| Background | `#241a23` |
| Ink | `#f0e4d0` |
| Muted | `#a99070` |
| Accent | `#db924b` (your existing `--primary`) |
| Strong rule | `rgba(240,228,208,.4)` |
| Hairline | `rgba(240,228,208,.16)` |
| Hover wash | `rgba(240,228,208,.05)` |
| Ambient blob | `rgba(219,146,75,.14)` |
| Overlay veil | `rgba(32,22,31,.85)` |

### Radii & borders
- Radius is **0 almost everywhere** (newspaper). Exceptions: theme-toggle pill `border-radius: 999px`; action buttons `border-radius: 2px`.
- Signature borders: `3px double <ink>` (dialogs, masthead top rule uses `3px double <strong rule>`), `1px solid` strong rule (entry tops), `1px solid`/`1px dashed` hairline (subtle frames, placeholders), `2px solid <ink>` (search underline), `2px solid <hairline>` (weekly-menu left rule).
- No box-shadows anywhere inside the design (flat print look).

### Spacing
- Page padding: 48px horizontal. Masthead top: 36px.
- Column grid: 3 equal columns, `column-gap: 36px`, `align-items: start`.
- Entry: `padding: 16px 2px 20px`, `border-top: 1px solid <strong rule>`.
- Dish line gap: 5px. Weekly day-block gap: 10px. Section gaps within entry: 8–12px.

---

## Screens / Views

There is one screen (the home page). Structure top-to-bottom:

### 1. Masthead (replaces the H1 + both Alert banners)
- **Top rule row** — `border-bottom: 3px double <strong rule>; padding-bottom: 6px`; flex, space-between, baseline-aligned. Three items, all `Archivo 600 11.5px/1, letter-spacing .22em`, muted color:
  - Left: `ÅRG. 1 — NR 133` (issue number; can be day-of-year).
  - Center: `SÖDERMALM · ONSDAG 9 JULI 2026` (live date, Swedish, uppercase).
  - Right: **theme toggle** — pill button, `border: 1px solid <strong rule>; border-radius: 999px; padding: 7px 14px; font: Archivo 600 11px, letter-spacing .1em`, transparent bg. Label: `LJUS UPPLAGA` in light mode, `KVÄLLSUPPLAGA` in dark. Hover: inverted (bg = ink, text = paper). Persist choice (localStorage/next-themes).
- **Masthead title** — `Lunchbladet.` — DM Serif Display 400, `font-size: 96px; line-height: .95; letter-spacing: -.015em`, centered, ink; the trailing period is accent-colored. Margins `14px 0 4px`.
- **Tagline** — centered italic DM Serif 15px/1.5, muted: `Tio kök, en tidning, noll beslutsångest — menyerna hämtas direkt från källan.` Below it `border-bottom: 1px solid <hairline>; padding-bottom: 14px`.
- **Relocated weekend warning** (replaces the yellow `bg-warning` Alert) — centered italic DM Serif 13px/1.6 in **accent** color, `padding-top: 10px`: `N.B. — På helger & röda dagar kan menyerna vara opålitliga; vi trycker vad restaurangerna själva publicerar.` Always visible; you may show it only on weekends/holidays if preferred (existing `Restaurant.isWeekend()` logic) — design assumes always-on.
- The old "Loading N restaurants" alert is **removed**. Per-card Suspense skeletons cover loading (see §7).

### 2. Controls row (replaces sticky search + SelectRandom)
Flex row, space-between, `align-items: flex-end`, `padding: 18px 48px 8px`.
- **Search (left, max-width 420px, flex 1)**
  - Kicker label above: `EFTERLYSNING` — Archivo 700 10.5px, letter-spacing .24em, muted, margin-bottom 8px.
  - Input: transparent background, **no border except** `border-bottom: 2px solid <ink>`; DM Serif Display *italic* 19px/1.3 ink; `padding: 4px 2px 8px`; placeholder `Sök i veckans alla spalter…`. Focus: bottom border becomes accent. Keep the existing 300ms debounce + jotai `searchAtom`.
  - Search matches restaurant name, today's items, **and weekly items** (existing behavior); non-matching entries unmount/hide.
- **Randomizer (right)** — flex row, gap 14px, center-aligned:
  - Label: `Redaktionen väljer:` italic DM Serif 15px muted.
  - **Value window**: min-width 180px, centered, DM Serif Display 19px in accent, `border-bottom: 1px solid <hairline>`, `padding: 2px 8px 6px`, nowrap. Idle text: `— osignerat —`.
  - **SLUMPA button**: bg ink, text paper, no border, `border-radius: 2px`, Archivo 700 12px letter-spacing .16em, `padding: 13px 20px`. Hover: bg accent. Active: `scale(.96)`.
  - **ångra** (only when a winner exists): borderless text button, italic DM Serif 14px muted, underlined; hover → ink. Resets `randomizedRestaurantAtom`.
  - **Spin behavior** (replaces the instant toast): on click, the value window cycles through restaurant names — ~30 steps, delay per step `45 + (n/total)^2.2 * 240` ms (starts ~45ms, decelerates to ~285ms, total ≈ 2s); while spinning the window shakes (`translateY ±2px`, 120ms loop). On settle: winner is set, and the **winner overlay** (§6) shows for 4.5s, then auto-dismisses. Losers dim to `opacity: .25` (see §4); ångra restores.

### 3. Restaurant entries (replaces shadcn Card grid)
CSS grid `grid-template-columns: 1fr 1fr 1fr; column-gap: 36px; padding: 20px 48px 44px`. Entries in scraper-shuffled order.

Each **entry**:
- `border-top: 1px solid <strong rule>; padding: 16px 2px 20px; transition: all .3s ease`. Hover: background = hover wash. Winner: background = `rgba(176,103,42,.1)` (accent 10%).
- **Header row** — flex, baseline, gap 10px:
  - Index `01`…`10`: Archivo 700 11px, letter-spacing .1em, accent.
  - Name: DM Serif Display 23px/1.1 ink.
  - **Map trigger** (`⌖ KARTA`) pushed right with `margin-left: auto` — borderless text button, Archivo 700 10px letter-spacing .16em, muted; hover: accent + underline. Rendered only when `address || coordinates` (existing MapButton guard). Use the `⌖` glyph or lucide `MapPin` at 12px.
- **Info line** (from `additionalInformation`, optional): italic DM Serif 12.5px/1.5 muted, `margin: 0 0 8px 21px` (indented to align under the name).
- **Today's dishes** (from `menuToday`): column, gap 5px. Each line: `— <dish>` Archivo 400 14px/1.5 ink. Search-matched dish: color accent + `text-decoration: underline; text-underline-offset: 3px`.
- **Weekly menu** (from `restaurant.menu`, when non-empty) — replaces the shadcn Accordion:
  - Trigger: borderless text button, `HELA VECKAN — {days} DAGAR · {items} RÄTTER ▾` — Archivo 700 10px letter-spacing .18em muted (chevron 8px, ▲ when open); margin-top 12px; hover → accent.
  - Expanded panel: `margin-top: 10px; padding-left: 12px; border-left: 2px solid <hairline>`; day blocks gap 10px. Day label: Archivo 700 10.5px letter-spacing .18em accent uppercase, margin-bottom 4px. Items: Archivo 400 13px/1.5 ink, gap 3px, search-highlight same as today.
  - **Auto-open when the search query matches a weekday item.** Manual toggle state per restaurant otherwise.
- **Image-only fallback** (when `menuImgUrl` and no scraped menu; e.g. Blå Dörren) — replaces RestaurantMenuFallback's Dialog:
  - Framed box `border: 1px solid <hairline>; padding: 14px; margin-top: 8px` containing: an 84px-tall thumbnail area (render the real `menuImgUrl` scaled, `object-fit: cover`; prototype shows a striped placeholder), then a row: italic DM Serif 12.5px muted `Trycker menyn endast som bild.` + button `VISA MENYBILD` (outline: `1px solid <ink>`, radius 0, Archivo 700 10px letter-spacing .14em, `padding: 8px 12px`; hover inverted). Opens the **image dialog** (§5).
- **No-menu notice** (when no menu, no image): italic DM Serif 13.5px/1.6 muted, margin-top 8px: `Ingen meny i pressläggningen — har köket flyttat sin sida, eller är de lata denna vecka?`
- **Winner stamp** (winner only): `★ REDAKTIONENS VAL` — Archivo 700 10px letter-spacing .18em accent, margin-top 10px.
- **Error state** (RestaurantCardError equivalent — not in prototype, follow the same language): entry keeps index + name + map trigger; body is an italic muted notice like the no-menu one, e.g. `Pressläggningsfel — kunde inte nå källan.` plus the error message in Archivo 12px muted.

### 4. Winner / loser treatment
When `randomizedRestaurantAtom` is set: winner entry gets accent-wash background + stamp; **all other entries stay mounted but dim to `opacity: .25`** (the current app unmounts them — change to dimming; transition `.3s ease`). `ångra` restores.

### 5. Dialogs (map + menu image) — replace shadcn Dialog styling
Shared chrome:
- Overlay: fills the viewport, `background: <overlay veil>; backdrop-filter: blur(3px)`. Click outside closes.
- Panel: `background: <paper>; border: 3px double <ink>; padding: 24px`; **no radius, no shadow**; entrance `popin` — `scale(.85)→1 + fade, 350ms cubic-bezier(.2,1.4,.4,1)`.
- Header: title DM Serif Display 26px ink (`{Name} — hitta hit` / `{Name} — menyn`), right-aligned `stäng` text button (italic DM Serif 14px muted underlined; hover ink).
- **Map dialog** (width 640px): address line italic DM Serif 14px muted under the title; Google Maps embed `340px` tall, `border: 1px dashed <hairline>` frame (keep existing embed URL logic); footer centered, gap 12px: `PROMENADVÄG` (filled ink, hover accent) + `ÖPPNA DESTINATION` (outline 1px ink, hover inverted), both radius 2px, Archivo 700 11px letter-spacing .16em, `padding: 12px 18px`, linking to the existing walking-directions/destination URLs; below, centered italic DM Serif 12px muted: `promenad från Östgötagatan 12`.
- **Menu-image dialog**: the `menuImgUrl` image at up to ~400×520 (keep aspect), same double-border panel.

### 6. Winner overlay (replaces sonner toast)
Same overlay chrome as §5, `z-index` above dialogs. Panel additionally `transform: rotate(-1.5deg); max-width: 420px; text-align: center; padding: 36px 44px`, entrance 450ms same easing. Contents, top to bottom:
1. `EXTRA! EXTRA!` — Archivo 700 11px letter-spacing .3em muted, margin-bottom 10px.
2. Winner name — DM Serif Display 40px/1 accent, margin-bottom 8px.
3. `Redaktionens dom — no take backsies!` — italic DM Serif 15px ink, margin-bottom 16px.
4. **The existing Pooh gif** (`https://media0.giphy.com/media/.../DAUiUaCVfBTFe/200w.gif`), max-width 200px, centered, `filter: sepia(.3)`.
Auto-dismiss after 4500ms; clicking anywhere may also dismiss.

### 7. Loading skeletons (adapt existing RestaurantCardSkeleton)
Keep Suspense-per-card. Restyle skeleton to the entry layout: border-top rule, index + name (name is known pre-fetch — render it real), then 3 shimmering text bars (hairline-colored, widths 100%/75%/50%, height 12px, radius 0), `animate-pulse`.

### 8. Ambient motion & micro-interactions
- **Blob**: absolutely positioned radial gradient circle, 420px, top -120px / right -100px, `radial-gradient(circle, <blob> , transparent 65%)`, animation `drift` (translate(60px,-40px) scale(1.15)) 26s ease-in-out infinite alternate. `pointer-events: none`.
- **Rotating asterisk**: `*` in DM Serif Display, `font-size: 340px`, hairline color, bottom 40px / left -60px, rotating 360° over 80s, linear infinite. `pointer-events: none; user-select: none`.
- Both must respect `prefers-reduced-motion: reduce` (pause them), as should the spin shake.
- Hover transitions everywhere: `.3s ease` on entries; color transitions on text buttons.

## State Management (maps to existing atoms)
- `searchAtom` (jotai) — unchanged; add weekly-item matching + auto-open.
- `randomizedRestaurantAtom` — unchanged trigger; new spin animation runs locally in the randomizer component before setting it; losers dim instead of unmounting.
- New local state: `theme` (light/dark, persisted), `expandedWeeks: Record<name, boolean>`, `mapDialogFor`, `imageDialogFor`, `spinning`, `overlayVisible`.

## Assets
- Google Fonts: DM Serif Display, Archivo.
- Pooh gif: existing giphy URL (above).
- No icon set needed: glyphs `⌖ ★ ▲ ▼ *` are typographic (lucide MapPin acceptable for ⌖).
- Menu images & map embeds come from existing scraper data / Google Maps.

## Files
- `Lunch Redesign Directions.dc.html` — the prototype. **Option 2a (top section) is the spec**; it's fully interactive: try theme toggle, search (e.g. "ärtsoppa" auto-opens weekly menus), SLUMPA, ⌖ KARTA, VISA MENYBILD.
- Existing app files this replaces/restyles: `page.tsx`, `RestaurantGrid.tsx`, `RestaurantCard.tsx`, `RestaurantCardSuccess.tsx`, `RestaurantCardError.tsx`, `RestaurantFullMenu.tsx`, `RestaurantMenuFallback.tsx`, `RestaurantSearchBar.tsx`, `SelectRandom.tsx`, `MapButton.tsx`, `globals.css`.
