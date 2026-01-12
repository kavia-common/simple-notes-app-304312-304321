# Simple Notes App (React)

A lightweight single-page notes application built with React and vanilla CSS.

## Features

- Create, edit, and delete notes (with confirm on delete)
- Search notes by title or body
- Sort by updated date (recent / oldest)
- Notes persist in the browser via `localStorage` (no backend)
- Seeded with sample notes on first load
- Accessible modal editor (labels, Escape to close, basic focus trap, focus restore)

## Data model

Each note is stored as:

- `title` (required)
- `body` (plain text, markdown-friendly)
- `updatedAt` (epoch ms timestamp)

## Running locally

From this directory:

```bash
npm start
```

Open http://localhost:3000

## Project structure

- `src/App.js` – app shell, state, filtering/sorting, CRUD flows
- `src/components/*` – UI components (list, item, editor modal, search, sort)
- `src/utils/storage.js` – localStorage CRUD + first-run seeding
- `src/utils/format.js` – small formatting helpers
- `src/App.css` – app styling and theme variables
