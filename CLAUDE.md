# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MGIIP Map - an interactive map application visualizing urban development grant data across Russian settlements. Built with Vite, React, and Mapbox GL JS, displaying settlement locations with clustering support.

## Development Commands

```bash
npm install           # Install dependencies
npm run dev           # Start dev server at http://localhost:5173
npm run build         # Production build
npm run preview       # Preview production build
npm run typecheck     # Run TypeScript type checking
npm run lint          # Lint and format check (biome check)
npm run fix           # Auto-fix lint and formatting issues (biome check --write)
npm run format-check  # Check formatting only (biome format)
npm run test          # Run unit tests (vitest)
```

## Architecture

### Tech Stack
- Vite + React 18
- react-map-gl/mapbox for map rendering
- Biome for linting and formatting (replaces ESLint)
- Vitest for unit testing
- leva for debug controls (toggle between data display modes)
- @turf/bbox for geographic calculations

### Data Flow
- 89 GeoJSON dataset files in `/public` (`dataset1.geojson` through `dataset89.geojson`) contain settlement data
- Each dataset is loaded as a separate clustered layer for performance
- Data properties include: федеральный округ, регион, нп, тип, население, подавался, победители
- **Dataset files in `/public` are read-only. Never modify them — adapt the code instead.**

### Key Components
- `app/App.tsx` - Main app with leva controls for toggling label display mode
- `app/components/map.tsx` - Mapbox GL map with 89 dataset layers and clustering
- `app/components/dataset-layer.tsx` - Individual GeoJSON layer with cluster/unclustered point rendering
- `app/components/map-popup/` - Popup component showing settlement details on hover

### Environment Variables
Requires two Vite environment variables (prefix `VITE_`):
- `VITE_MAPBOX_ACCESS_KEY` - Mapbox access token
- `VITE_MAPBOX_STYLE` - Mapbox style URL

### Path Aliases
Use `~/` to import from `app/` directory (configured in tsconfig.json).
