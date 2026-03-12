# Repository Instructions

## Project shape

- This repo is a small Cloudflare Worker project.
- `src/index.js` is the Worker entrypoint.
- `public/` contains the static site served through the `ASSETS` binding.
- `wrangler.jsonc` defines Worker configuration and must stay consistent with code changes.

## Commands

- Install dependencies: `npm install`
- Run locally: `npm run dev`
- Check Cloudflare auth: `npm run cf:whoami`
- Deploy: `npm run deploy`

## Delivery workflow

- All implementation work must happen in a git worktree on a dedicated branch.
- All code changes must land through a pull request. Do not commit directly to the primary branch.
- Every pull request must be reviewed by a reviewer agent before merge.
- Review feedback must be addressed fully. Keep iterating until the reviewer is satisfied, then merge.
- When creating Linear issues for this project, assign them to Matt Anderson by default unless told otherwise.

## Working style

- Prefer small, direct edits over introducing new tooling or abstractions.
- Keep the Worker simple; do not add frameworks unless the task clearly requires one.
- Update `README.md` when setup or runtime behavior changes materially.
- Use the existing npm lockfile; do not switch package managers.
- Leave the codebase better than you found it. Avoid shortcuts that create future maintenance debt.

## Type safety

- Prefer strong, explicit types and designs that make invalid states hard to represent.
- Do not use type casts. No `as`, no angle-bracket casts, and no "trust me" typing shortcuts.
- When TypeScript is introduced or expanded, solve typing issues at the model and API boundary instead of casting through them.

## Performance

- Care about bundle size and startup cost. Choose lean solutions and avoid unnecessary dependencies.
- Keep the shipped site fast, simple, and easy to load on mobile connections.
- If adding client-side JavaScript, justify it against the cost in bytes and complexity.

## Validation

- Run the narrowest useful validation for the task.
- If no automated test exists, use a concrete manual or command-based verification step and report it.
- Do not run deployment as a validation step unless the task explicitly asks for a deploy.

## Guardrails

- Treat Cloudflare credentials as optional environment state; if they are missing, report the blocker clearly.
- Avoid editing unrelated infrastructure or repo metadata during feature work.
- Keep generated or temporary files out of commits.
- Make implementation choices with future growth in mind; prefer maintainable structure over quick patches.
