# Travel Globe

A cinematic personal travel journal built around an interactive 3D Earth. Rotate and zoom the globe, discover destinations, save travel memories and keep a visual bucket list—all in the browser.

## Features

- Realistic draggable 3D globe with atmosphere, idle rotation, responsive zoom and smooth destination fly-to
- Distinct visited and bucket-list markers with rich hover previews
- Click anywhere on Earth to save coordinates, or search the world with OpenStreetMap's free Nominatim service
- Persistent create, edit, delete, status, rating, notes, tags, dates, and local photo uploads
- Filterable travel collection, destination details, galleries, and compact journey statistics
- Responsive glass UI with mobile bottom sheets, keyboard labels, focus states, and reduced-motion support
- Defensive LocalStorage parsing and replaceable storage/search service boundaries

## Tech stack

React, TypeScript, Vite, Three.js via `react-globe.gl`, Lucide React, and plain component-scoped design tokens/CSS. Data is stored in LocalStorage; world search uses the public OpenStreetMap Nominatim endpoint. No paid API key is required.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run build
npm run lint
npm run preview
```

## Deployment

Import the repository in **Vercel**, keep the Vite preset, and deploy. The build command is `npm run build` and output directory is `dist`. There are no localhost URLs or required environment variables. It can also be deployed as a static `dist` directory to any host.

## Structure

```text
src/components/   globe, place, sidebar, search, and statistics UI
src/data/         removable first-run demo destinations
src/hooks/        persistent travel collection state
src/services/     replaceable LocalStorage and geocoding adapters
src/types/        shared domain model
```

## Prototype notes

Uploaded photos are encoded as data URLs inside LocalStorage, which has browser-dependent capacity. The `travelStorage` service and photo model are deliberately isolated so a production deployment can swap in Supabase Storage/database without rewriting UI components. Earth textures and demo photography are loaded from public CDNs and therefore require a network connection.
