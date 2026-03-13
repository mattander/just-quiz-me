# Just Quiz Me

Just Quiz Me is now a TanStack Start app shell for Phase 1, running on React, TypeScript, Vite 8, Tailwind, and Cloudflare Workers while preserving the current coming-soon landing experience at `/`.

## Project shape

- `src/router.tsx` registers the TanStack Start router.
- `src/server.ts` bridges Cloudflare Worker bindings into the TanStack Start request context.
- `src/routes/__root.tsx` owns the document shell and shared route metadata.
- `src/routes/index.tsx` renders the current landing hero through the new app shell.
- `src/lib/runtime-config.ts` centralizes validated runtime config parsing for the server.
- `src/lib/app-settings.ts` validates the seeded Phase 1 app settings contract.
- `src/lib/app-settings-repository.ts` provides the backend settings read path, preferring D1 and falling back to the seeded defaults when the database binding is unavailable.
- `src/routeTree.gen.ts` is generated on demand by `npm run generate:routes` and stays out of git.
- `src/tailwind.source.css` is compiled into the generated `src/tailwind.css` utility layer.
- `src/styles.css` defines the shared visual tokens and non-generated app styles.
- `src/content/settings/index.ts` holds the default seeded runtime settings.
- `src/content/quizzes/index.ts` holds the authored quiz manifests that seed D1.
- `public/` holds static assets such as the favicon and robots file.
- `migrations/` contains the D1 schema migrations for Phase 1 quiz data.
- `wrangler.jsonc` points Cloudflare at the built Start server bundle and client assets.
- `worker-configuration.d.ts` is generated from Wrangler config via `npm run cf:typegen`.

## Commands

```bash
npm install
npm run cf:typegen
npm run content:validate
npm run db:migrate:local
npm run content:sync:local
npm run generate:routes
npm run test:repository
npm run dev
npm run build
npm run typecheck
npm run cf:whoami
npm run deploy
```

## Workflow

- Keep implementation work on a dedicated branch or worktree.
- Land changes through a pull request rather than committing on the primary branch.
- Use [`WORKFLOW.md`](./WORKFLOW.md) when running the repo through Symphony.
- The current Symphony Codex command is `codex --config shell_environment_policy.inherit=all --config model_reasoning_effort=medium --model gpt-5.4 app-server`.

## Hosting notes

- Local development uses Vite on port `3000` and runs a Tailwind CLI watcher in parallel so the generated utility layer stays current.
- `npm run dev` also refreshes `worker-configuration.d.ts` and loads the `env.local` bindings from `wrangler.jsonc` into the Node SSR process before Vite starts.
- Production deploys should go through `npm run deploy`, which builds the TanStack Start output and then hands the generated Cloudflare bundle to Wrangler.
- The landing page now renders the existing coming-soon hero through TanStack Start so the production path stays on the app shell without reintroducing a separate static runtime.
- `workers_dev` remains disabled so the existing custom-domain deployment setup stays intact.
- Runtime config is currently validated from two Wrangler-managed bindings: `APP_ENV` and `PUBLIC_SITE_URL`, with production defaults plus preview and local-development overrides defined in `wrangler.jsonc`.
- A local-only D1 binding named `QUIZ_DB` now backs the Phase 1 schema for development and seed validation without checking placeholder remote database IDs into shared deploy config.
- Quiz authoring manifests and default settings live in code and can be checked with `npm run content:validate`, then synced into local D1 with `npm run db:migrate:local` followed by `npm run content:sync:local`. The migration command targets Wrangler's `local` environment because the `QUIZ_DB` binding is intentionally scoped there.
- Runtime settings reads now flow through a server-side repository path so the app can honor D1-backed settings when available while keeping the seeded `adsEnabled: false` default intact for environments without a database binding yet.

## License

This repository is intentionally `UNLICENSED` for now.

- The current product and business model are still forming, so the repo is staying proprietary while commercialization options remain open.
- That avoids granting open-source or source-available rights by accident through placeholder metadata.
- The licensing decision should be revisited intentionally if the project is later prepared for a public release.

Until that changes, all rights are reserved. See [`LICENSE`](./LICENSE) for the current terms.
