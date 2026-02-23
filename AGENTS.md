# AGENTS.md

## Project Overview

- Stack: Vite + Vanilla TypeScript
- UI routes:
  - `/` (public bio links page)
  - `/icon-lab/` (icon rendering quality gate)
- Data source files:
  - `src/data/profile.config.ts`
  - `src/data/links.config.ts`

## Standard Commands

```bash
npm install
npm run dev
npm run test:unit
npm run test:e2e
npm run build
npm run preview
```

## Source-of-Truth Rules

- Icon definitions are managed in `src/icons/catalog/`.
- QR URL behavior is implemented in `src/lib/resolveQrUrl.ts`.
- Keep generated outputs out of version control:
  - `dist/`
  - `output/`
  - `test-results/`
  - `.playwright-cli/`
  - `tmp/`

## QR URL Behavior

- Production (`import.meta.env.DEV === false`): use current page URL.
- Development (`import.meta.env.DEV === true`):
  - If host is loopback (`localhost`, `127.0.0.1`, `::1`), replace host in this order:
    1. `VITE_DEV_LAN_HOST`
    2. auto-detected LAN IPv4 (`__AUTO_DEV_LAN_HOST__`)
  - If no replacement host exists, keep current URL.

## Testing Expectations

- Before push:
  - `npm run test:unit`
  - `npm run build`
- Before release-quality changes:
  - `npm run test:e2e`

## Feature Constraints

- Threads icon/link mapping is intentionally unsupported.
- If reintroducing Threads support, update:
  - `src/types/icon.ts`
  - `src/lib/iconMap.ts`
  - `src/icons/catalog/`
  - corresponding tests
