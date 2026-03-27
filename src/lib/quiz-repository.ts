import * as v from 'valibot'
import { quizManifests } from '../content/quizzes/index.ts'
import { parseQuizManifest, type QuizManifest } from './quiz-manifest.ts'

const quizIdentifierSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Quiz identifiers cannot be empty.'),
)

const storedPublishedQuizSummaryRowSchema = v.object({
  slug: quizIdentifierSchema,
  title: v.pipe(v.string(), v.trim(), v.minLength(1)),
  description: v.pipe(v.string(), v.trim(), v.minLength(1)),
})

const storedPublishedQuizRowSchema = v.object({
  slug: quizIdentifierSchema,
  title: v.pipe(v.string(), v.trim(), v.minLength(1)),
  description: v.pipe(v.string(), v.trim(), v.minLength(1)),
  manifest_json: v.pipe(v.string(), v.trim(), v.minLength(1)),
})

export type PublishedQuiz = Omit<QuizManifest, 'id' | 'status'>
export type PublishedQuizSummary = Pick<
  PublishedQuiz,
  'slug' | 'title' | 'description'
>
export type PublishedQuizResult = PublishedQuiz['results'][number]

type StoredPublishedQuizSummaryRow = v.InferOutput<
  typeof storedPublishedQuizSummaryRowSchema
>
type StoredPublishedQuizRow = v.InferOutput<typeof storedPublishedQuizRowSchema>

export type QuizRepository = {
  listPublished(): Promise<PublishedQuizSummary[]>
  readPublished(slug: string): Promise<PublishedQuiz | null>
  readPublishedResult(
    quizSlug: string,
    resultId: string,
  ): Promise<PublishedQuizResult | null>
}

export function createQuizRepository(
  database: D1Database | undefined,
): QuizRepository {
  if (!database) {
    return createSeededQuizRepository()
  }

  return createD1QuizRepository(database)
}

function createSeededQuizRepository(): QuizRepository {
  return {
    async listPublished() {
      return quizManifests
        .filter((manifest) => manifest.status === 'published')
        .map(toPublishedQuizSummary)
    },
    async readPublished(slug) {
      const manifest = findSeededPublishedManifest(slug)

      return manifest ? toPublishedQuiz(manifest) : null
    },
    async readPublishedResult(quizSlug, resultId) {
      const manifest = findSeededPublishedManifest(quizSlug)

      if (!manifest) {
        return null
      }

      return manifest.results.find((result) => result.id === resultId) ?? null
    },
  }
}

function createD1QuizRepository(database: D1Database): QuizRepository {
  return {
    async listPublished() {
      const rowResult = await database
        .prepare(
          `
            SELECT slug, title, description
            FROM published_quizzes
            ORDER BY slug ASC
          `,
        )
        .all<StoredPublishedQuizSummaryRow>()

      return rowResult.results.map(parseStoredPublishedQuizSummaryRow)
    },
    async readPublished(slug) {
      return readStoredPublishedQuiz(database, slug)
    },
    async readPublishedResult(quizSlug, resultId) {
      const quiz = await readStoredPublishedQuiz(database, quizSlug)

      if (!quiz) {
        return null
      }

      return quiz.results.find((result) => result.id === resultId) ?? null
    },
  }
}

async function readStoredPublishedQuiz(
  database: D1Database,
  slug: string,
): Promise<PublishedQuiz | null> {
  const quizRow = await database
    .prepare(
      `
        SELECT slug, title, description, manifest_json
        FROM published_quizzes
        WHERE slug = ?
        LIMIT 1
      `,
    )
    .bind(slug)
    .first<StoredPublishedQuizRow>()

  if (!quizRow) {
    return null
  }

  const storedQuiz = parseStoredPublishedQuizRow(quizRow)
  const parsedManifest: unknown = JSON.parse(storedQuiz.manifest_json)
  const manifest = parseQuizManifest(parsedManifest)

  return toPublishedQuiz(manifest)
}

function findSeededPublishedManifest(slug: string): QuizManifest | undefined {
  return quizManifests.find(
    (manifest) => manifest.slug === slug && manifest.status === 'published',
  )
}

function toPublishedQuiz(manifest: QuizManifest): PublishedQuiz {
  return {
    slug: manifest.slug,
    title: manifest.title,
    description: manifest.description,
    results: manifest.results,
    questions: manifest.questions,
  }
}

function toPublishedQuizSummary(manifest: QuizManifest): PublishedQuizSummary {
  return {
    slug: manifest.slug,
    title: manifest.title,
    description: manifest.description,
  }
}

function parseStoredPublishedQuizSummaryRow(
  input: StoredPublishedQuizSummaryRow,
): PublishedQuizSummary {
  const result = v.safeParse(storedPublishedQuizSummaryRowSchema, input)

  if (!result.success) {
    throw new Error(
      `Invalid published quiz summary row.\n${v.summarize(result.issues)}`,
    )
  }

  return result.output
}

function parseStoredPublishedQuizRow(
  input: StoredPublishedQuizRow,
): StoredPublishedQuizRow {
  const result = v.safeParse(storedPublishedQuizRowSchema, input)

  if (!result.success) {
    throw new Error(`Invalid published quiz row.\n${v.summarize(result.issues)}`)
  }

  return result.output
}
