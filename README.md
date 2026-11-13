# Snigdha Datta — Portfolio

A single-page developer portfolio with a white anime/manga-inspired design.
Built with TanStack Start, React, TypeScript and Tailwind CSS.

## Requirements

- Node.js 20+ and npm

## Development

```sh
npm install
npm run dev
```

The dev server runs at <http://localhost:8080>.

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Production build             |
| `npm run preview` | Preview the production build |
| `npm run test`    | Run the test suite           |
| `npm run lint`    | Lint the project             |
| `npm run format`  | Format with Prettier         |

## Live GitHub data

The About section fetches GitHub activity server-side. Set `GITHUB_TOKEN`
(a token with `read:user` access) in the environment to enable live data;
without it, the baked snapshot in `src/lib/contributions.ts` is used.

## Structure

```
src/
  routes/       # file-based routes (single page: index.tsx)
  components/   # GithubStars, Highlighter
  lib/          # profile data, GitHub fetching, error helpers
  assets/       # avatar and logos
  styles.css    # manga design system
```

## Deployment

The default build targets Cloudflare Workers via Nitro. For GitHub Pages,
the site needs a static adapter because it is a server-rendered TanStack
Start app.
