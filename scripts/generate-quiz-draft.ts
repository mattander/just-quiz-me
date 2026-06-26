import { getPlatformProxy } from 'wrangler'
import {
  defaultQuizGenerationModel,
  generateQuizDraftWithOpenAi,
} from '../src/lib/openai-quiz-generator.ts'
import { createQuizRepository } from '../src/lib/quiz-repository.ts'

const args = process.argv.slice(2)

function readFlag(name: string): string | null {
  const flagIndex = args.indexOf(`--${name}`)

  if (flagIndex === -1) {
    return null
  }

  return args[flagIndex + 1] ?? null
}

function hasFlag(name: string): boolean {
  return args.includes(`--${name}`)
}

function requireFlag(name: string, usage: string): string {
  const value = readFlag(name)

  if (!value) {
    throw new Error(usage)
  }

  return value
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '')
}

function requireOpenAiApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required to generate quiz drafts.')
  }

  return apiKey
}

function buildSourceIdentifier(slug: string): string {
  const githubRunId = process.env.GITHUB_RUN_ID

  if (githubRunId) {
    return `github-actions:${githubRunId}:${slug}`
  }

  return `local:${Date.now()}:${slug}`
}

async function main() {
  const usage =
    'Usage: npm run content:generate -- --title "Which..." --premise "..." [--slug quiz-slug] [--model gpt-5.4-mini] [--print-only]'
  const title = requireFlag('title', usage)
  const premise = requireFlag('premise', usage)
  const slug = readFlag('slug') ?? slugify(title)
  const model = readFlag('model') ?? defaultQuizGenerationModel

  if (!slug) {
    throw new Error('Quiz slug could not be derived. Provide --slug explicitly.')
  }

  const generatedDraft = await generateQuizDraftWithOpenAi(
    {
      title,
      premise,
      slug,
    },
    buildSourceIdentifier(slug),
    {
      apiKey: requireOpenAiApiKey(),
      model,
    },
  )

  if (hasFlag('print-only')) {
    console.log(JSON.stringify(generatedDraft, null, 2))
    return
  }

  const { env, dispose } = await getPlatformProxy<Pick<Cloudflare.LocalEnv, 'QUIZ_DB'>>(
    {
      environment: 'local',
    },
  )

  try {
    const repository = createQuizRepository(env.QUIZ_DB)
    const summary = await repository.ingestGeneratedDraft(generatedDraft)

    console.log(
      `Generated draft revision ${summary.id} for "${summary.title}" with ${summary.sourceModel}.`,
    )
  } finally {
    await dispose()
  }
}

await main()
