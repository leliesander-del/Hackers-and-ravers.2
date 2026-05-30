# StoreNav — your personal shopping assistant

A web app that makes the physical shopping experience **personal** — from the moment you open the app to the moment you reach the right shelf. Just like Uber shows you which rides are relevant based on where you are and where you're going, StoreNav shows you which stores and products are interesting for you *right now* — and once you're in the store, it leads you straight to the right shelf.

Think: **Uber's personalized home screen** + **Klarna's loyalty-card layer** + **indoor navigation**, all built around one principle: **everything the user sees is tailored to who they are.**

---

## 🧭 The common thread: personalization

Personalization is not a feature in this app. It's the **fundamental assumption** everything is built around. Every screen, every list, every route and every alternative is filtered, sorted or weighted based on the user's profile.

Concretely that means: a guest and a logged-in member see **a different app**. Not just "the same app with a name on top", but genuinely different content, different ordering, different recommendations.

We make that difference explicit in every layer of the app — that's what sells the project.

---

## 📖 Problem and solution

Customers face three points of friction in physical shopping:

1. **Before the store** — "where should I go for what I need?" People google, scroll through separate store apps, or guess.
2. **Entering the store** — "where is this thing?" Endless wandering or interrupting staff.
3. **At an empty shelf** — "it's not here". The sale is gone, often the customer too.

StoreNav solves all three, with personalization at its core:

| Moment | What StoreNav does |
|---|---|
| **Before the store** | Personal home screen with nearby stores, your regular stores, and stores on your route with products you'll likely enjoy. |
| **In the store** | Optimized route along your shopping list, personalized on-location deals. |
| **At an empty shelf** | Alternatives that match **your** preferences (brand, diet, price tier), not generic "other products in the same category". |

## 🎯 Target audiences

| Audience | What they get |
|---|---|
| **The new user** | An accessible home screen based on location alone, with an invitation to personalize by logging in. |
| **The member (loyalty card)** | A genuinely personal experience — home screen, search results, routes and alternatives are all tailored to them. |
| **The store** | More relevant footfall (people come because they're genuinely interested), higher conversion via alternatives, insight into search behavior. |

---

## 🎯 Scope — what's in, and what's not

### In scope (core demo)

This must work in the hackathon demo and be jury-proof:

1. **Personal home screen (Uber-style)** with three sections:
   * **Stores near you** — based on (simulated) location.
   * **Your regular stores** — for logged-in members, based on history.
   * **On your route** — stores along a defined route with products that match your preferences.
2. **Loyalty-card login** — two to three sample profiles that each produce their own home screen and shopping experience.
3. **Per store: floor plan + search** — open a store, search for a product, get a route over a 2D SVG floor plan.
4. **QR entry as an alternative** — a QR at the store entrance opens that store directly in the app (skips the home screen).
5. **Personalized search results** — members see their preferred brands at the top, with diet tags that match their profile.
6. **Alternatives with profile weighting** — an empty shelf shows alternatives that aren't just in the same category, but also match the user's preferences.
7. **Shopping-list mode** — multiple products at once; route optimized along all stops.
8. **On-location loyalty deals** — members see personalized deals for products they likely want.

### Out of scope (stretch)

* Live indoor positioning (Bluetooth beacons, WiFi).
* Camera/barcode scanner for products.
* Integration with real POS/inventory systems of stores.
* Staff dashboard with search statistics.
* Semantic "similar to" matching via embeddings.
* Real authentication and GDPR-compliant data storage.
* Push notifications when you get near a relevant store.

### Explicitly not included

* Payments or checkout functionality.
* Real personal data — all profiles are fictional.
* Unlimited number of stores — for the demo we build out 3 to 4, of which 1 has a full floor plan.

---

## ✨ Features in detail — with personalization as the common thread

### 1. The home screen — where personalization becomes immediately tangible

When the app opens (without a QR scan), you see an Uber-like screen:

**For a guest (not logged in):**
* One section: "Stores near you" — based on location only.
* A subtle banner at the top: "Log in with your loyalty card to see personal recommendations."

**For a logged-in member:**
* **Welcome header** with name and loyalty balance.
* **Section 1 — "Good morning, Sander"** — nearby stores, but already sorted by your preference (e.g. supermarkets above clothing stores if you mostly do groceries).
* **Section 2 — "Your regular stores"** — stores you visit more often, with quick access to your shopping list.
* **Section 3 — "On your route"** — if you've defined a destination (e.g. "to work"), we show stores along that route with products you'll likely enjoy. For example: "AH XL Bruges is on your route and has your favorite coffee on sale this week."
* **Section 4 (optional) — "Maybe something for you"** — stores you don't know yet, but that sell products matching your profile.

This screen is the **core of the pitch**. Here you see at a glance that the app knows who you are.

### 2. The loyalty card — what's in a profile

On the login screen we show 2 to 3 sample profiles, each with a recognizable personality that visibly leads to different results in the demo:

| Profile | Characteristics |
|---|---|
| **Sander** | Mostly does groceries, gluten-free diet, premium brands, lives in central Bruges. |
| **Lies** | Sporty millennial, regularly buys sportswear and healthy snacks, budget-conscious, cycles everywhere. |
| **Marc** | Family father, big weekly groceries, likes buying on sale, fixed route school–work–home. |

Each profile has:
* **Preferences** — favorite brands, diet tags, price tier, product categories they buy a lot.
* **History** — previously visited stores and previously purchased products.
* **Fixed route** — a simulated daily route (home–work, or home–school–work).
* **Shopping list** — a saved list for "this trip".
* **Loyalty balance** — points and active deals.

When switching between profiles during the demo you see the **whole home screen change**, and the shopping experience afterwards too. That's the power of the demo.

### 3. Opening a store

Three ways to end up at a store:

1. **Tapping a store card** from the home screen.
2. **Scanning a QR** at the store entrance (skips home screen, opens that store directly with location "entrance").
3. **Directly via a product** — if you tap "Sander's favorite coffee is on sale at AH XL" from the home screen, the store opens and the route to that product is already loaded.

### 4. In the store — floor plan and route

The store is modeled internally as a **graph**:
* **Nodes** — intersections, aisle ends, shelves.
* **Edges** — walkable connections with weight (distance).

We render an SVG floor plan and draw the route with **Dijkstra** (or A* as an optimization) as a clear line over the map. For multiple stops (member with a shopping list) we use a **greedy nearest-neighbour TSP** — fast enough for 5–10 products and gives a logical order.

### 5. Product search — we personalize here too

The search field gives live results. For members:
* **Preferred brands at the top** — if you often buy brand X, brand X coffee appears above brand Y coffee.
* **Diet tags visible and filtered** — a gluten-free member sees gluten-free options first, or a hint "💡 this contains gluten" on unsuitable products.
* **Suggestions from your list and history** — before you type anything, we show your saved shopping list and "previous purchases" as quick picks.

For a guest: just alphabetical or relevance-sorted, no tags.

### 6. Alternatives on unavailability — personal again

When a product is out of stock:

1. **Category match** — other products in the same (sub)category, in stock. *(Basic, also for guests.)*
2. **Attribute overlap** — score on brand, price, size. *(Basic.)*
3. **Profile weighting** — for members, preferences count extra heavily. A gluten-free member will **never** see a gluten-containing alternative up front. *(Personalization.)*
4. **Taking location into account** — priority to alternatives near the current route, to avoid having to walk through the whole store.

Result: a row of 3 to 5 alternatives, each with a location, route button, and for members a short explanation of why it's recommended ("same brand, on sale this week").

### 7. On-location loyalty deals — personal, not generic

In the seed data we mark ~10 products as "on sale this week". But for members we only show **deals that are relevant to them**:

* Sander (gluten-free) does see the deal on gluten-free pasta, not the one on regular pasta.
* Marc (family father, budget-conscious) mostly sees bulk packs and multipack deals.
* Lies (sporty) sees sport-related products and healthy snacks.

During a route, relevant deal products get a badge on the floor plan and in the list. It feels like the app was made for you — because it was.

---

## 🧠 Architecture

```
┌─────────────────────────────────────────────────┐
│  Frontend (React, single-page)                  │
│                                                 │
│  ├─ Home screen (personal, Uber-style)          │
│  │   ├─ Location detection (simulated)          │
│  │   ├─ Profile engine (sorting & filtering)    │
│  │   └─ Store cards with deep links             │
│  │                                              │
│  ├─ Store view                                  │
│  │   ├─ SVG floor plan                          │
│  │   ├─ Search (personalized)                   │
│  │   ├─ Route logic (Dijkstra + greedy TSP)     │
│  │   └─ Alternatives engine (weighted)          │
│  │                                              │
│  └─ Profile layer (available everywhere)        │
│      ├─ Active profile state                    │
│      ├─ Preferences, history, list              │
│      └─ Loyalty & deals                         │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Seed data (JSON, in repo)                      │
│  ├─ stores (location, category, floor plan)     │
│  ├─ products (per store, attributes, stock)     │
│  ├─ deals                                       │
│  ├─ sample profiles (3)                         │
│  └─ simulated user location                     │
└─────────────────────────────────────────────────┘
```

All logic runs in the frontend with seed data. No backend, no database, no server dependency during the demo. That gives a guaranteed-to-work demo and a short stack.

## 📦 Data model

| Entity | Fields (core) |
|---|---|
| **Store** | id, name, type (supermarket/clothing/etc.), location (lat/lng), opening hours, has-floor-plan (bool) |
| **Product** | id, store-id, name, EAN, category-id, attributes (brand, size, price, diet tags), stock status, shelf-location-id, deal-id |
| **Category** | id, name, parent-id |
| **Location (shelf)** | id, store-id, label, graph-node-id, SVG coordinate (x, y) |
| **Floor plan** | store-id, graph (nodes + edges), SVG source |
| **Deal** | id, product-id, discount, audience tags |
| **Profile** | id, name, preferences (brands, diet, price tier, categories), history (store ids, product ids), fixed route (line of points), shopping list, loyalty points |
| **User location** | (simulated) current lat/lng + active route |

The crucial intersection we make — and where the "magic" lives — is **profile × location × product data**. That's what drives the personalization.

### The personalization engine — how it works

For every list (stores on the home screen, search results, alternatives) the same flow runs:

1. **Filter** on hard criteria (within X km, stock available, diet-compatible).
2. **Score** per item based on:
   * Match with preferences (high weight).
   * History (have you shopped/bought here before?).
   * Location/route (distance to current position or route).
   * Deals (loyalty deals count extra).
3. **Sort** descending on total score.
4. **Label** why this item is on top ("your regular store", "on sale", "matches your preference").

For a guest we largely skip step 2 and sort only by distance.

---

## 🛠️ Tech stack

| Component | Technology |
|---|---|
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| Floor plans | Hand-drawn SVG per store |
| Route logic | JavaScript — graph + Dijkstra, greedy TSP for multiple stops |
| Personalization engine | JavaScript — weighted scoring functions |
| Outdoor map (nearby stores) | Leaflet + OpenStreetMap tiles (free, no API key) |
| State | React Context for the active profile, localStorage for the session |
| Data | JSON files in `/src/data/` |
| QR generation | `qrcode` npm package |
| Hosting | Vercel or Netlify, HTTPS by default |

No backend. No database. One external service (OSM tiles) for the outdoor map, free and without authentication.

---

## 🔒 Security (Aikido check)

The data surface stays small, which works in our favor:

* **No API keys, tokens or secrets in the repo** — `.env` with `.env.example`, `.env` in `.gitignore`.
* **Dependencies up to date** — keep `npm audit` clean.
* **Input validation** on the search function (XSS-safe).
* **HTTPS required** — automatic via Vercel/Netlify, needed for the location API in the browser.
* **No real personal data** — profiles are hardcoded and fictional.
* **CSP headers** — strict Content Security Policy via hosting config.
* **Respect location permission** — if the user denies the geo API, fall back to a selected city without errors.

### Privacy disclaimer for the pitch

A product that combines personal profiles, history and location touches directly on GDPR. Not relevant for the demo (everything fictional), but in the pitch we explicitly mention: opt-in, data minimization, transparency about which data is used for what, and short retention periods. Jurors always ask about that with this type of idea.

---

## 🗺️ Roadmap — build order

From **certainty to showpiece**. Each block is a finished, demoable unit.

### Block 1 — Foundation (day 1 morning)

**Goal:** project structure stands, profile layer works, empty app runs.

1. Set up Vite + React + Tailwind.
2. Create profiles JSON (3 personas with all fields).
3. React Context for the active profile — switching already works, even if there's nothing to show yet.
4. Simple header with "logged in as X" / "continue as guest", and a button to switch.

### Block 2 — The personal home screen (day 1 afternoon)

**Goal:** the pitch already works, even without the in-store flow.

5. Stores JSON with 6–8 stores (lat/lng, type, name).
6. Leaflet map with markers for nearby stores.
7. Below the map: sections "Nearby", "Your regular stores", "On your route" with store cards.
8. Personalization engine v1: scoring function that returns a different order per profile. **Demo moment:** switch profile, screen changes completely.
9. For "On your route": draw a simulated route on the map (hardcoded polyline per profile) and filter stores nearby.

### Block 3 — Opening a store + floor plan (day 1 end / day 2 morning)

**Goal:** tap a store → see the floor plan.

10. SVG floor plan for one store (5–6 aisles). Other stores may get a "floor plan coming soon" placeholder — focus on one well-developed store.
11. Graph data structure over the SVG, with (x, y) per node.
12. Routing: implement Dijkstra, don't draw the empty route yet.

### Block 4 — Product search with personalization (day 2 morning)

**Goal:** search works, and is clearly different per profile.

13. Products JSON for the main store: ~30 products, linked to shelf locations, ~6 out of stock.
14. Search with live filtering.
15. Result sorting per profile: preferred brands at the top, diet-incompatible products with a warning or at the bottom.
16. **Demo moment:** same search term ("pasta"), two profiles, two different top results.

### Block 5 — Route on floor plan + alternatives (day 2 afternoon)

**Goal:** clicking a product = route, and an empty shelf = personal alternatives.

17. Tap a product → draw a route on the SVG.
18. Detect "out of stock" → alternatives panel.
19. Scoring function with profile weighting: category + attribute overlap + preferences + location proximity.
20. **Demo moment:** search an empty product with two profiles, get two different top alternatives.

### Block 6 — Shopping list & on-location loyalty (day 2 end)

**Goal:** the full picture — multiple stops, personalized deals visible along the way.

21. Shopping list per profile (from JSON, ~5 products).
22. Greedy TSP routing along all products in the list.
23. Deals JSON with ~10 deals.
24. Only show deals that match the active profile (on product category and preference tags).
25. Badge on the floor plan and in the list for relevant deal products.

### Block 7 — QR + polish (day 3 morning)

**Goal:** demo-ready.

26. Deploy the app, claim a live URL.
27. Generate a QR code with `?store=ah-xl-bruges&entry=entrance` as the query, print it on A4.
28. Visual polish: colors, typography, transitions, mobile-first check.
29. **Rehearse the demo script** — exactly 3 minutes, show the profile switch, one clear walkthrough.

### Block 8 — Stretch (only if 1–7 are done)

In this order:

30. **Zone QRs** within one store as repositioning points.
31. **Camera/barcode scanner** for products (`html5-qrcode`).
32. **Mini analytics** on `/admin`: most searched products per profile type.

---

## 🚀 Getting started

### Requirements

* **Node.js 20+** with npm ([nodejs.org](https://nodejs.org/) or `winget install OpenJS.NodeJS.LTS`)
* After installing: open a **new terminal** so `node` and `npm` are on the PATH

### Installation

```bash
git clone https://github.com/leliesander-del/Hackers-and-ravers.2.git
cd Hackers-and-ravers.2
npm install
```

**Windows (PowerShell)** — if `npm` isn't recognized:

```powershell
.\scripts\setup.ps1   # one-time: install dependencies
.\scripts\dev.ps1     # start the dev server
```

**TLS error during `npm install`** (school/uni network): the repo contains an `.npmrc` with `strict-ssl=false`. Remove that line once you're on a network where npm works normally.

### Running

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

| Command | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | View the production build locally |

For testing on mobile: deploy to Vercel/Netlify (free) and open the URL on your phone. The location API only works over HTTPS.

---

## 📋 Definition of Done — core demo

The demo is "done" when:

* [ ] The home screen shows a **visibly different** order and selection of stores for each of the 3 profiles.
* [ ] Switching profiles refreshes the home screen in real time.
* [ ] "Continue as guest" gives a noticeably stripped-down version of the home screen.
* [ ] Tap a store → floor plan opens.
* [ ] Scanning a QR opens the same store directly, with starting point "entrance".
* [ ] Searching for a product gives different top results per profile.
* [ ] Out-of-stock product → profile-specific alternatives with a route button.
* [ ] Member with a shopping list → one optimized route along ≥4 products.
* [ ] Loyalty deals are only visible to relevant profiles.
* [ ] The app runs live on an HTTPS URL, mobile-friendly.
* [ ] The 3-minute demo pitch is ready, with the explicit profile switch as the climax.

---

## 🎤 The pitch in one sentence

> "We're building a personal assistant for physical stores — an Uber-like home screen that shows you which stores and products are relevant for you right now, and once you're in the store, a personal route along your groceries, with alternatives and deals that genuinely suit you."
