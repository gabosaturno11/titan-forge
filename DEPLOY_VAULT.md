# Saturno Vault — Deployment

## Vercel (production)

- **Project:** titan-forge
- **Gate (login):** `/gate.html` — public
- **Vault (protected):** `/vault` → `/bonus.html` — requires auth cookie
- **Bonus (protected):** `/bonus.html` — requires auth cookie (legacy URL)
- **CF4 (protected):** `/tools/cf4-full-program-bonus/*` — requires auth cookie

## Env vars (Vercel dashboard or CLI)

- `VAULT_PASSWORD` — password users enter to unlock (e.g. saturno2025)
- `VAULT_TOKEN` — random string for auth cookie (e.g. `openssl rand -hex 24`)

## Flow

1. User visits `/vault` (or `/bonus.html`) → middleware redirects to `/gate.html` if no cookie
2. User enters password on `/gate.html` → POST to `/api/verify`
3. If correct (`password === VAULT_PASSWORD`), `/api/verify` sets `vault_auth` cookie (value = `VAULT_TOKEN`), returns 200
4. Client redirects to `/vault`; middleware sees valid cookie, allows access → serves `bonus.html`

## Deploy

```bash
vercel --prod
```

## No internal tool links

Bonus page links only to: CF4, Handstand Movement Lab, Progression Tracker, PDFs. No FORGE, CAPTURE, TITAN, NEXUS, or other internal tools.
