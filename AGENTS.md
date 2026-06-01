# AGENTS.md

## Cursor Cloud specific instructions

StoreNav (Never Lost) is a **single Vite + React SPA** at the repo root. There is **no backend**, database, or Docker. All data is seed JSON under `src/data/` plus `localStorage`.

### Services

| Service | Port | Required |
|---------|------|----------|
| Vite dev server | 5173 | MUST |

No other local processes are required for core development.

### Commands

See `package.json` and `README.md` for standard scripts:

- `npm install` — dependencies (npm + `package-lock.json`; Node 20+)
- `npm run dev` — dev server with HMR (default http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve `dist/` locally

There are **no** `lint` or `test` scripts in this repo. Use `npm run build` and `npm audit` as the primary automated checks.

### Starting the dev server

From repo root:

```bash
npm run dev -- --host 0.0.0.0
```

Use `--host 0.0.0.0` when the app must be reachable outside localhost (e.g. browser tools on the VM).

### Demo logins (hardcoded, no env vars)

| Flow | Credentials |
|------|-------------|
| Customer | `sander@neverlost.be` / `sander123`, `marc@neverlost.be` / `marc123`, `gast@neverlost.be` / `gast` |
| Staff | `lisa@neverlost.be` / `lisa123` → `/personeel` |
| Manager | Store `ah-xl`, password `ahxl` → `/beheer/login` |

No `.env` or `VITE_*` variables are used.

### Hello-world smoke test

1. Open http://localhost:5173 → `/login`
2. Log in as `sander@neverlost.be` / `sander123`
3. Open `/store/ah-xl`, use product search, open **Bekijk de plattegrond** for the SVG route map

### Notes

- `.npmrc` sets `strict-ssl=false` for restrictive networks; remove on trusted networks if desired.
- Windows-only helpers: `scripts/setup.ps1`, `scripts/dev.ps1` — on Linux use `npm install` and `npm run dev` directly.
- Leaflet/OSM tiles and external favicon URLs are optional and need outbound HTTPS only when those UI paths are used.
