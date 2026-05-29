# Setup

## Requirements

- Node.js 18 or later
- npm

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

The development server runs at `http://localhost:3000`.

## Build

```bash
npm run build
```

Production assets are written to `dist/`.

## Configuration

- **Multiple-choice mode** runs entirely in the browser with no configuration.
- **Written-answer feedback** requires an LLM API key, provided via the `VITE_ANTHROPIC_API_KEY` environment variable. For local development, create a `.env` file in the project root:

  ```
  VITE_ANTHROPIC_API_KEY=your_key_here
  ```

Session data and progress are stored in the browser via `localStorage`; no database is required.
