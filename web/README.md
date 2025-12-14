yarn dev
## Overview

This package hosts the Next.js client for the Ikasi teacher dashboard. The previously standalone Vite demo that lived under `web/to-integrate` has been migrated into the main application and is rendered from `app/DashboardApp.tsx`.

Visiting [http://localhost:3000](http://localhost:3000) now loads the full teacher experience (sidebar, header tools, agenda, attendance, calendar, meetings, etc.). All React components, mock data and helpers were lifted from `to-integrate` and converted to idiomatic Next.js client components that live under `src/app`.

## Getting Started

```bash
pnpm dev --filter @ikasi/web
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Notes

- The primary entry point is `src/app/DashboardApp.tsx`, which stitches together the migrated dashboard widgets.
- Shared data models and mocks can be found in `src/app/dashboard-*.ts` files.
- UI primitives rely on `lucide-react` for icons and `recharts` for charts.
- Tailwind CSS v4 (via the `@tailwindcss/postcss` preset) powers the utility classes.

Feel free to add new routes or components following the existing patterns. The legacy Vite scaffold remains under `web/to-integrate` for reference; remove it once it’s no longer needed.
