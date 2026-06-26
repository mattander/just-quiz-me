# Just Quiz Me

Just Quiz Me is a TanStack Start app on Cloudflare Workers for fast, absurd, highly shareable quizzes. The public site ships a lightweight homepage, multiple published quizzes, and immediate result pages from the same repo and runtime.

## Project shape

- `src/router.tsx` registers the TanStack Start router.
- `src/server.ts` bridges Cloudflare Worker bindings into the TanStack Start request context.
- `src/routes/__root.tsx` owns the document shell and shared route metadata.
- `src/routes/index.tsx` renders the public homepage with the featured quiz and additional published quiz links.
- `src/routes/quiz.$quizSlug.tsx` renders the playable quiz questionnaire and submission flow.
- `src/routes/quiz.$quizSlug.result.tsx` renders the resolved result view for a scored quiz run.
- `src/lib/quiz-service.ts` owns the server-side published quiz reads plus submission validation and scoring.
- `src/lib/runtime-config.ts` centralizes validated runtime config parsing for the server.
- `src/lib/app-settings.ts` validates the seeded Phase 1 app settings contract.
- `src/lib/app-settings-repository.ts` provides the backend settings read path, preferring D1 and falling back to the seeded defaults when the database binding is unavailable.
- `src/lib/analytics.ts` owns the lightweight analytics adapter boundary and browser-event default implementation.
- `src/lib/quiz-analytics.ts` provides quiz-specific tracking helpers for start, submit, result, and share events.
- `src/routeTree.gen.ts` is generated on demand by `npm run generate:routes` and stays out of git.
- `src/tailwind.source.css` is compiled into the generated `src/tailwind.css` utility layer.
- `src/styles.css` defines the shared visual tokens and non-generated app styles.
- `src/content/settings/index.ts` holds the default seeded runtime settings.
- `src/content/quizzes/index.ts` holds the authored quiz manifests that seed D1.
- `public/` holds static assets such as the favicon.
- `migrations/` contains the D1 schema migrations for Phase 1 quiz data.
- `wrangler.jsonc` points Cloudflare at the built Start server bundle and client assets.
- `worker-configuration.d.ts` is generated from Wrangler config via `npm run cf:typegen`, then sanitized to remove build-only type imports so clean-checkout typechecks stay reliable.

## Commands

```bash
npm install
npm run cf:typegen
npm run content:validate
npm run db:migrate:local
npm run content:sync:local
npm run generate:routes
npm test
npm run test:repository
npm run test:e2e
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
- `npm run dev` also refreshes and sanitizes `worker-configuration.d.ts`, then loads the `env.local` bindings from `wrangler.jsonc` into the Node SSR process before Vite starts.
- `npm run dev:e2e` starts the app on port `4173` without long-running watchers so Playwright can run against a stable local target.
- Production deploys should go through `npm run deploy`, which builds the TanStack Start output and then hands the generated Cloudflare bundle to Wrangler while explicitly targeting the top-level production environment.
- The homepage is intentionally simple and text-first, with the featured quiz and the rest of the published quiz pile available from the root route.
- `workers_dev` remains disabled so the existing custom-domain deployment setup stays intact.
- Runtime config is currently validated from two Wrangler-managed bindings: `APP_ENV` and `PUBLIC_SITE_URL`, with production defaults plus preview and local-development overrides defined in `wrangler.jsonc`.
- Cloudflare Web Analytics is wired as the free hosted analytics provider. Set `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` to the Web Analytics site token to emit the deferred Cloudflare beacon; leave it blank to disable analytics without code changes. The GitHub deploy workflow can inject this from the repository variable `CLOUDFLARE_WEB_ANALYTICS_TOKEN`.
- Sentry is initialized for browser and Worker-side error monitoring. Browser monitoring uses the TanStack Start SDK, while the Worker is wrapped with Sentry's Cloudflare SDK so deploy validation stays compatible with Cloudflare Workers. Source map uploads run through the Vite plugin when the GitHub repository secret `SENTRY_AUTH_TOKEN` is available; repository variables `SENTRY_ORG` and `SENTRY_PROJECT` can override the default `mattdev-z3` / `just-quiz-me` project settings.
- A local-only D1 binding named `QUIZ_DB` now backs the Phase 1 schema for development and seed validation without checking placeholder remote database IDs into shared deploy config.
- Quiz authoring manifests and default settings live in code and can be checked with `npm run content:validate`, then synced into local D1 with `npm run db:migrate:local` followed by `npm run content:sync:local`. The sync flow now imports authored manifests into the revision-aware quiz schema and refreshes the published quiz projection used by the runtime read path. The migration command targets Wrangler's `local` environment because the `QUIZ_DB` binding is intentionally scoped there.
- Generated quiz drafts can now be ingested as reviewable D1 revisions with source provenance and review status; they do not appear in public reads until a later explicit publish workflow updates the publication pointer/projection.
- Runtime settings reads now flow through a server-side repository path so the app can honor D1-backed settings when available while keeping the seeded `adsEnabled: false` default intact for environments without a database binding yet.
- Public quiz reads now load from the published projection in D1 instead of reconstructing quiz payloads from the Phase 1 normalized tables, which keeps loaders, scoring, and sitemap generation stable while editorial storage evolves behind that boundary.
- The public quiz flow runs at `/quiz/:quizSlug`, validates a full answer set on submission, and redirects into `/quiz/:quizSlug/result` using URL state instead of persisted attempts.
- Browser-level confidence for the public loop now lives in `tests/e2e/public-flow.spec.ts`, covering homepage discovery, the featured quiz submission flow, and an invalid quiz route boundary.
- Route-level metadata now covers the homepage, quiz, and result pages, while the Worker serves `robots.txt` and `sitemap.xml` from the same runtime-configured site URL and published quiz list.
- Analytics remains opt-in and lightweight by default: the shipped browser adapter simply dispatches a typed `justquizme:analytics` event on `window`, and richer integrations can be injected into quiz tracking call sites without introducing shared runtime state.
- To get the Cloudflare Web Analytics token, open the Cloudflare dashboard, go to **Analytics & Logs > Web Analytics**, add `justquiz.me`, and copy the token from the generated JavaScript snippet. The standard beacon script supports History API single-page apps by default, so TanStack Router page transitions are tracked without extra client code.

## License

This repository is intentionally `UNLICENSED` for now.

- The current product and business model are still forming, so the repo is staying proprietary while commercialization options remain open.
- That avoids granting open-source or source-available rights by accident through placeholder metadata.
- The licensing decision should be revisited intentionally if the project is later prepared for a public release.

Until that changes, all rights are reserved. See [`LICENSE`](./LICENSE) for the current terms.
