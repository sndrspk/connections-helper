# Connections Helper

## Overview

A web app to help solve the daily NYT Connections puzzle without wasting guesses. Users can enter 16 words manually or fetch today's puzzle, then drag-and-drop tiles into four color-coded swim lanes to experiment with groupings before committing to answers on the real puzzle.

## Tech Stack

- **React 19** with Vite for fast local development
- **@dnd-kit** for drag-and-drop (core + sortable + utilities)
- **LocalStorage** for state persistence across browser sessions
- **GitHub Pages** for deployment (auto-deploys on push to `main`)
- **Cloudflare Worker** as a CORS proxy for the NYT API in production
- **Vite proxy** to fetch today's NYT puzzle in dev mode (avoids CORS issues)

## Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Main app: state management, DnD context, layout
├── App.css                   # All component styles
├── index.css                 # CSS variables, resets, global styles
├── storage.js                # LocalStorage read/write helpers
└── components/
    ├── SetupScreen.jsx       # Word entry (manual or fetch) before puzzle starts
    ├── PuzzleGrid.jsx        # 4×4 grid of unsorted tiles (droppable)
    ├── SwimLane.jsx          # Colored lane with description input (droppable)
    └── Tile.jsx              # Draggable tile (used in both grid and lanes)

worker/
├── index.js                  # Cloudflare Worker: CORS proxy for NYT API
└── wrangler.toml             # Cloudflare Worker config
```

## Key Architecture Decisions

- **Single DndContext** wraps both the puzzle grid and all swim lanes. Tiles can be dragged between any containers.
- **State model**: `gridTiles` (array of tiles in the main grid) and `lanes` (array of 4 lane objects, each with `id`, `description`, and `tiles`). A tile exists in exactly one location.
- **Tile identity**: Each tile gets a stable `id` (`tile-0` through `tile-15`) assigned at puzzle start.
- **NYT API**: Fetches from `https://www.nytimes.com/svc/connections/v2/YYYY-MM-DD.json`. In dev mode, a Vite proxy handles CORS. In production, a Cloudflare Worker (`https://connections-temp.sndrspk.workers.dev/puzzle`) proxies the request with CORS headers.
- **Colors**: Four custom lane colors (pink, brown, orange, pastel cyan) intentionally different from NYT's official yellow/green/blue/purple to avoid confusion with difficulty levels.

## Deployment

- **Frontend**: Hosted on GitHub Pages at `https://sndrspk.github.io/connections-helper/`
  - Auto-deploys via GitHub Actions on push to `main` (see `.github/workflows/deploy.yml`)
- **API proxy**: Cloudflare Worker at `https://connections-temp.sndrspk.workers.dev`
  - Deploy manually: `cd worker && wrangler deploy`
  - Free tier (100k requests/day), runs on Cloudflare's edge — no local process needed
- LocalStorage ensures each device/browser has its own independent state

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (includes NYT API proxy)
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

## Development Notes

- The app uses `@dnd-kit/core` (not `react-beautiful-dnd` or HTML5 drag) for better touch support and flexibility.
- Paste support: in manual entry mode, pasting a comma-separated or newline-separated list into any input auto-fills subsequent inputs.
- State is saved to LocalStorage on every change. Clicking "New Puzzle" clears saved state.
- **Double-click to move**: Double-clicking a tile in the puzzle grid sends it to the first swim lane with fewer than 4 tiles (skipping locked lanes). Double-clicking a tile in a swim lane sends it back to the puzzle grid. Locked lane tiles cannot be double-clicked.
- Font: Libre Franklin loaded from Google Fonts (similar to NYT's editorial style).
