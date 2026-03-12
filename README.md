Placeholder text.

Cloudflare setup:

- Install dependencies with `npm install`
- Authenticate with `npx wrangler login`
- Verify the account with `npm run cf:whoami`
- Run locally with `npm run dev`
- Deploy with `npm run deploy`

Symphony setup:

- The repo now includes a starter [`WORKFLOW.md`](/Users/matt/dev/just-quiz-me/WORKFLOW.md) tailored for this Cloudflare Worker.
- The workflow is already pointed at the Linear project [`Just Quiz Me`](https://linear.app/mattdev/project/just-quiz-me-50696acecb69/overview).
- This setup uses your current Linear states: `Todo`, `In Progress`, `In Review`, `Done`, `Canceled`, and `Duplicate`.
- Set `LINEAR_API_KEY` before starting Symphony.
- The workflow uses this Codex app-server command: `codex --config shell_environment_policy.inherit=all --config model_reasoning_effort=xhigh --model gpt-5.3-codex app-server`
- Run Symphony from a checkout of [`openai/symphony`](https://github.com/openai/symphony), usually from its `elixir/` directory, and point it at this repo's [`WORKFLOW.md`](/Users/matt/dev/just-quiz-me/WORKFLOW.md).

Example:

```bash
export LINEAR_API_KEY=your_linear_token
cd /path/to/symphony/elixir
mise trust
mise install
mise exec -- mix setup
mise exec -- ./bin/symphony /Users/matt/dev/just-quiz-me/WORKFLOW.md --port 4300 --i-understand-that-this-will-be-running-without-the-usual-guardrails
```
