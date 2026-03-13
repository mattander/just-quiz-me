# Just Quiz Me

Just Quiz Me is a minimal Cloudflare Worker project that serves a branded coming-soon landing page from static assets.

## Project shape

- `src/index.js` passes incoming requests through to the `ASSETS` binding.
- `public/index.html` contains the landing page.
- `wrangler.jsonc` defines the Worker entrypoint and asset binding.
- Production serves the existing `justquiz.me` custom domain with `workers_dev` disabled in `wrangler.jsonc`.

## Commands

```bash
npm install
npm run dev
npm run cf:whoami
npm run deploy
```

## Workflow

- Keep implementation work on a dedicated branch or worktree.
- Land changes through a pull request rather than committing on the primary branch.
- Use [`WORKFLOW.md`](./WORKFLOW.md) when running the repo through Symphony.
