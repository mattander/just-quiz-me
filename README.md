# Just Quiz Me

Just Quiz Me is now a TanStack Start app shell for Phase 1, running on React, TypeScript, Vite 8, Tailwind, React Query, TanStack Form, Valibot, and Cloudflare Workers.

## Project shape

- `src/router.tsx` registers the TanStack Start router.
- `src/server.ts` bridges Cloudflare Worker bindings into the TanStack Start request context.
- `src/routes/__root.tsx` owns the document shell and shared route metadata.
- `src/routes/index.tsx` renders the current Phase 1 app shell landing experience.
- `src/lib/runtime-config.ts` centralizes validated runtime config parsing for the server.
- `src/lib/foundation.ts` holds the typed shell snapshot plus the Valibot-backed input schemas used at the current foundation boundary.
- `src/routeTree.gen.ts` is generated on demand by `npm run generate:routes` and stays out of git.
- `src/tailwind.source.css` is compiled into the generated `src/tailwind.css` utility layer.
- `src/styles.css` defines the shared visual tokens and non-generated app styles.
- `public/` holds static assets such as the favicon and robots file.
- `wrangler.jsonc` points Cloudflare at the built Start server bundle and client assets.
- `worker-configuration.d.ts` is generated from Wrangler config via `npm run cf:typegen`.

## Commands

```bash
npm install
npm run cf:typegen
npm run generate:routes
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
- `npm run dev` also refreshes `worker-configuration.d.ts` and loads the `env.local.vars` bindings from `wrangler.jsonc` into the Node SSR process before Vite starts.
- Production deploys should go through `npm run deploy`, which builds the TanStack Start output and then hands the generated Cloudflare bundle to Wrangler.
- The landing shell now exercises React Query, TanStack Form, and Valibot directly so the declared Phase 1 stack is wired into the running app instead of only installed as dependencies.
- `workers_dev` remains disabled so the existing custom-domain deployment setup stays intact.
- Runtime config is currently validated from two Wrangler-managed bindings: `APP_ENV` and `PUBLIC_SITE_URL`, with `production`, `preview`, and `local` values defined in `wrangler.jsonc`.

## License

This repository is intentionally `UNLICENSED` for now.

- The current product and business model are still forming, so the repo is staying proprietary while commercialization options remain open.
- That avoids granting open-source or source-available rights by accident through placeholder metadata.
- The licensing decision should be revisited intentionally if the project is later prepared for a public release.

Until that changes, all rights are reserved. See [`LICENSE`](./LICENSE) for the current terms.
