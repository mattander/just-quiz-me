---
tracker:
  kind: linear
  api_key: $LINEAR_API_KEY
  project_slug: "50696acecb69"
  active_states:
    - Todo
    - In Progress
    - In Review
  terminal_states:
    - Done
    - Canceled
    - Duplicate
polling:
  interval_ms: 5000
workspace:
  root: ~/code/symphony-workspaces
hooks:
  after_create: |
    git clone --depth 1 git@github.com:mattander/just-quiz-me.git .
    npm install
agent:
  max_concurrent_agents: 3
  max_turns: 20
codex:
  command: codex --config shell_environment_policy.inherit=all --config model_reasoning_effort=xhigh --model gpt-5.3-codex app-server
  approval_policy: never
  thread_sandbox: workspace-write
  turn_sandbox_policy:
    type: workspaceWrite
---

You are working on a Linear ticket `{{ issue.identifier }}` for the `just-quiz-me` repository.

{% if attempt %}
Continuation context:

- This is retry attempt #{{ attempt }} because the ticket is still active.
- Resume from the current workspace state instead of restarting.
- Do not repeat completed investigation or validation unless new changes require it.
{% endif %}

Issue context:
Identifier: {{ issue.identifier }}
Title: {{ issue.title }}
Current status: {{ issue.state }}
Labels: {{ issue.labels }}
URL: {{ issue.url }}

Description:
{% if issue.description %}
{{ issue.description }}
{% else %}
No description provided.
{% endif %}

Operating rules:

1. This is an unattended orchestration session. Never ask a human to perform follow-up actions.
2. Only stop early for a true blocker such as missing auth, missing secrets, or unavailable external services.
3. Final message must report completed actions and blockers only.
4. Work only inside the provided repository copy.
5. Start by reading `AGENTS.md`, `README.md`, and the files most relevant to the ticket before editing.

Repository notes:

- This project is a minimal Cloudflare Worker that serves static assets from `public/` via `src/index.js`.
- Package management uses `npm` and the lockfile in the repo.
- Main commands:
  - `npm install`
  - `npm run dev`
  - `npm run deploy`
  - `npm run cf:whoami`
- `wrangler.jsonc` is the source of truth for Worker entrypoint and asset binding.
- Linear project URL: `https://linear.app/mattdev/project/just-quiz-me-50696acecb69`

Execution expectations:

1. Reproduce or inspect the current behavior before changing code.
2. Keep scope tight and prefer simple implementations over framework-heavy rewrites.
3. Preserve the Cloudflare Worker + static assets shape unless the ticket explicitly requires a larger architecture change.
4. When changing UI, update files in `public/` unless the ticket requires Worker logic changes too.
5. When changing runtime behavior, keep `src/index.js` aligned with `wrangler.jsonc` bindings.
6. Validate changes with the lightest meaningful checks available. Prefer targeted inspection and runnable commands over skipping verification.
7. Do not deploy unless the ticket explicitly requires deployment and the needed credentials are already available in the session.
8. Use `In Progress` while actively implementing, move to `In Review` when the work is complete and validated, and return to `In Progress` if follow-up changes are needed.
9. Treat `Done`, `Canceled`, and `Duplicate` as terminal states.

Definition of done before handoff:

- The requested code changes are implemented.
- Relevant validation has been run and recorded.
- No placeholder debug code, temp files, or accidental artifacts remain.
- Notes clearly describe any blocker, risk, or missing credential that prevented full completion.
