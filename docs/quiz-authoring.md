# Quiz Authoring

Just Quiz Me quizzes should be absurd, but they should not feel random. A good quiz has a clear premise, answer options that map to understandable result paths, and results that feel specific enough to share.

## Draft Flow

1. Create a skeleton:

   ```sh
   npm run content:draft -- --title "Which Parking Lot Bird Is Judging You?"
   ```

2. Ask an LLM or editor to fill the draft while preserving the manifest shape.

3. Add the finished manifest to `src/content/quizzes/index.ts` with `status: 'draft'`.

4. Add result-page expansion copy in `src/content/result-enhancements.ts`.

5. Run validation:

   ```sh
   npm run content:validate
   npm test
   ```

6. Publish by changing the manifest status to `published`, then sync content into D1 when deployment operations are ready.

## Generated Drafts

Phase 2 AI-assisted generation uses the same quiz manifest contract, but generated output enters storage as an unreviewed draft revision instead of public content.

- Generated drafts must keep `status: 'draft'`.
- Draft ingestion records source provenance, including provider/model, source identifier, optional prompt, and optional JSON metadata.
- New generated revisions start with review status `generated`.
- Public reads continue to use the `published_quizzes` projection, so generated drafts stay invisible until an explicit review/publish command promotes them.
- The default generation target is OpenAI Responses API with `gpt-5.4-mini`, read from `OPENAI_API_KEY` in admin automation.

Generate and ingest a local D1 draft:

```sh
npm run content:generate -- --title "Which Office Plant Knows Too Much?" --premise "A quiz about office plants silently collecting workplace secrets."
```

Emit the generated draft payload as JSON without writing to D1:

```sh
npm run content:generate -- --title "Which Office Plant Knows Too Much?" --premise "A quiz about office plants silently collecting workplace secrets." --print-only
```

Generate a draft in GitHub Actions:

1. Open **Actions > Generate Quiz Draft** in GitHub.
2. Provide the title, premise, lowercase kebab-case slug, and model.
3. The workflow uses the `OPENAI_API_KEY` repository secret.
4. The workflow opens a pull request containing `generated-drafts/<slug>.json`.
5. Review the generated JSON before using editorial commands to approve or publish.

The workflow is intentionally manual-only while we prove the content quality bar. The cron schedule is present as a commented reminder, not an active trigger.

Review generated drafts:

```sh
npm run content:review -- list
npm run content:review -- inspect --revision quiz:which-office-plant-knows-too-much:revision:1
npm run content:review -- approve --revision quiz:which-office-plant-knows-too-much:revision:1
npm run content:review -- publish --revision quiz:which-office-plant-knows-too-much:revision:1
```

Use `reject` instead of `approve` when a draft should remain out of the publish path:

```sh
npm run content:review -- reject --revision quiz:which-office-plant-knows-too-much:revision:1
```

## Editorial Rules

- Every question should describe a situation a person can actually imagine.
- Every answer should imply a behavioral pattern, not just a funny noun.
- Every result should represent a distinct path through the quiz.
- Keep jokes calm and specific. Weird is good; nonsense is not.
- Prefer three results and four questions until the quiz has a reason to be larger.
- Result descriptions stay short for cards and metadata; longer payoff copy belongs in `result-enhancements.ts`.

## LLM Prompt Shape

Use this shape when generating a first pass:

```text
Write a Just Quiz Me quiz manifest for: [TITLE]

Voice: dry, internet-native, specific, grounded absurdity.
Structure: 3 results, 4 questions, 3 options per question.
Rules:
- Questions must be coherent situations.
- Options must map clearly to result personalities.
- Results must be distinct and shareable.
- Keep copy concise enough for mobile.
- Return only JSON matching the draft skeleton.
```
