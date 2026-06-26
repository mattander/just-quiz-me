import { getPlatformProxy } from 'wrangler'
import { createQuizRepository } from '../src/lib/quiz-repository.ts'

const args = process.argv.slice(2)
const command = args[0]

function readFlag(name: string): string | null {
  const flagIndex = args.indexOf(`--${name}`)

  if (flagIndex === -1) {
    return null
  }

  return args[flagIndex + 1] ?? null
}

function requireRevisionId(): string {
  const revisionId = readFlag('revision')

  if (!revisionId) {
    throw new Error(
      'Provide --revision with the draft revision id. Example: npm run content:review -- inspect --revision quiz:example:revision:1',
    )
  }

  return revisionId
}

async function main() {
  const { env, dispose } = await getPlatformProxy<Pick<Cloudflare.LocalEnv, 'QUIZ_DB'>>(
    {
      environment: 'local',
    },
  )

  try {
    const repository = createQuizRepository(env.QUIZ_DB)

    if (command === 'list') {
      console.log(JSON.stringify(await repository.listDraftReviews(), null, 2))
      return
    }

    if (command === 'inspect') {
      const draft = await repository.readDraftRevision(requireRevisionId())

      if (!draft) {
        throw new Error('Draft revision was not found.')
      }

      console.log(JSON.stringify(draft, null, 2))
      return
    }

    if (command === 'approve') {
      const summary = await repository.updateDraftReviewStatus(
        requireRevisionId(),
        'approved',
      )
      console.log(`Approved draft revision ${summary.id}.`)
      return
    }

    if (command === 'reject') {
      const summary = await repository.updateDraftReviewStatus(
        requireRevisionId(),
        'rejected',
      )
      console.log(`Rejected draft revision ${summary.id}.`)
      return
    }

    if (command === 'publish') {
      const summary = await repository.publishApprovedDraft(requireRevisionId())
      console.log(`Published "${summary.title}" at /quiz/${summary.slug}.`)
      return
    }

    throw new Error(
      'Usage: npm run content:review -- <list|inspect|approve|reject|publish> [--revision revision-id]',
    )
  } finally {
    await dispose()
  }
}

await main()
