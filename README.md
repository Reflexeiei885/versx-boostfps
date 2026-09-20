# VERSX Performance System

React/Vite frontend with a VERSX Neon Green login backed by a Vercel API route for KeyAuth license validation.

## Run locally

```bash
npm install
npm run dev
```

## Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

Optional environment variables:
- `KEYAUTH_NAME=DeltaVX`
- `KEYAUTH_OWNERID=igr22xSE8H`
- `KEYAUTH_VERSION=1.0`

The API route validates the KeyAuth response signature before accepting a license.
