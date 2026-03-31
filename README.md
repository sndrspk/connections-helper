# Connections Helper

A web app to help solve the daily NYT Connections puzzle without wasting guesses. Enter 16 words manually or fetch today's puzzle, then drag-and-drop tiles into four color-coded swim lanes to experiment with groupings.

**Live app:** https://sndrspk.github.io/connections-helper/

## Features

- Enter 16 words manually (with paste support) or fetch today's puzzle automatically
- 4x4 puzzle grid replicating the NYT layout
- Four color-coded swim lanes to drag tiles into and experiment with groupings
- Editable descriptions on each swim lane
- State persists in LocalStorage across sessions
- Works on desktop and mobile (touch-friendly drag-and-drop)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Tech Stack

- React 19 + Vite
- @dnd-kit for drag-and-drop
- Cloudflare Worker as NYT API proxy
- GitHub Pages for hosting

See [CLAUDE.md](./CLAUDE.md) for detailed architecture and development notes.
