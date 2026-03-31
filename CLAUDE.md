# Connections Helper

## Overview

A local web app to help solve the daily NYT Connections puzzle without wasting guesses. Users can enter 16 words manually or fetch today's puzzle, then drag-and-drop tiles into four color-coded swim lanes to experiment with groupings before committing to answers on the real puzzle.

## Tech Stack

- **React 19** with Vite for fast local development
- **@dnd-kit** for drag-and-drop (core + sortable + utilities)
- **LocalStorage** for state persistence across browser sessions
- **Vite proxy** to fetch today's NYT puzzle (avoids CORS issues)

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
```

## Key Architecture Decisions

- **Single DndContext** wraps both the puzzle grid and all swim lanes. Tiles can be dragged between any containers.
- **State model**: `gridTiles` (array of tiles in the main grid) and `lanes` (array of 4 lane objects, each with `id`, `description`, and `tiles`). A tile exists in exactly one location.
- **Tile identity**: Each tile gets a stable `id` (`tile-0` through `tile-15`) assigned at puzzle start.
- **NYT API proxy**: Vite dev server proxies `/api/puzzle` → `https://www.nytimes.com/svc/connections/v2/YYYY-MM-DD.json` to avoid CORS. Only works in dev mode.
- **Colors**: Four custom lane colors (purple, blue, orange, green) intentionally different from NYT's official yellow/green/blue/purple to avoid confusion with difficulty levels.

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
- The fetch feature depends on the Vite dev server proxy. In production, you'd need a separate proxy/backend or a CORS-friendly API endpoint.
- Font: Libre Franklin loaded from Google Fonts (similar to NYT's editorial style).
