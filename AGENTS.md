# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router entry point (`layout.tsx`, `page.tsx`, global styles). Add routes as nested folders with `page.tsx`.
- `components/ui/`: Reusable Radix/Tailwind building blocks (buttons, dialogs, forms). Prefer composing these instead of bespoke styles.
- `components/theme-provider.tsx`: Theme context wrapper; keep theme-aware components inside it.
- `hooks/`: Shared React hooks (e.g., `use-mobile`, `use-toast`). Add new hooks here, prefixing names with `use`.
- `lib/utils.ts`: Small utilities (e.g., `cn` for class merging).
- `styles/globals.css`: Tailwind 4 global styles; extend tokens here.
- `public/`: Static assets served at the root.
- Config: `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json` (shadcn/ui config).

## Build, Test, and Development Commands
- Install: `pnpm install` (prefer pnpm; lockfile is present).
- Develop: `pnpm dev` to run Next.js locally on port 3000.
- Lint: `pnpm lint` to run ESLint across the repo.
- Build: `pnpm build` for a production bundle.
- Start: `pnpm start` serves the production build (run `pnpm build` first).

## Coding Style & Naming Conventions
- Language: TypeScript + React with the Next.js App Router. Use functional components and hooks.
- Styling: Tailwind utility classes (v4) with design tokens; reuse `cn` from `lib/utils.ts` for conditional classes.
- Components: PascalCase exports; keep file names kebab-case (e.g., `user-card.tsx`) aligned with existing pattern.
- Hooks: camelCase files prefixed with `use-`; return tuples/objects with clear keys.
- Formatting/Linting: ESLint via `pnpm lint`; 2-space indentation; prefer named exports unless a single default is idiomatic.

## Testing Guidelines
- No test suite is present yet. When adding tests, colocate with features (e.g., `components/ui/__tests__/button.test.tsx`) or under `__tests__/`.
- Recommended stack: React Testing Library for components; Playwright for e2e when pages stabilize.
- Aim for meaningful coverage on complex logic; mock network calls and avoid hitting external services.

## Commit & Pull Request Guidelines
- Commit messages: concise, imperative, scoped (e.g., `Add carousel keyboard support`, `Fix toast theme regression`). Favor focused commits.
- PRs: include what/why/how, linked issues, and screenshots/GIFs for UI changes. Note any follow-ups or known limitations.
- Keep PRs small and incremental; ensure `pnpm lint` and `pnpm build` pass before requesting review.

## Security & Configuration Tips
- Store secrets in `.env.local` (git-ignored by default). Do not commit credentials.
- Verify external data handling and sanitize user input in new routes or API handlers.
