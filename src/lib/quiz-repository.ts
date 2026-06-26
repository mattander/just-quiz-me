import * as v from 'valibot'
import { quizManifests } from '../content/quizzes/index.ts'
import {
  parseGeneratedQuizDraftInput,
  parseQuizManifest,
  type QuizManifest,
} from './quiz-manifest.ts'

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

const draftReviewStatusSchema = v.picklist([
  'generated',
  'needs_review',
  'approved',
  'rejected',
])

const storedDraftReviewRowSchema = v.object({
  id: quizIdentifierSchema,
  quiz_id: quizIdentifierSchema,
  revision_number: v.pipe(v.number(), v.integer(), v.minValue(1)),
  source_kind: v.picklist(['ai_generated', 'manual_import', 'seed_manifest']),
  source_identifier: v.pipe(v.string(), v.trim(), v.minLength(1)),
  source_model: v.nullable(v.pipe(v.string(), v.trim(), v.minLength(1))),
  review_status: draftReviewStatusSchema,
  title: v.pipe(v.string(), v.trim(), v.minLength(1)),
  description: v.pipe(v.string(), v.trim(), v.minLength(1)),
})

const nextRevisionRowSchema = v.object({
  next_revision_number: v.pipe(v.number(), v.integer(), v.minValue(1)),
})

export type PublishedQuiz = Omit<QuizManifest, 'id' | 'status'>
export type PublishedQuizSummary = Pick<
  PublishedQuiz,
  'slug' | 'title' | 'description'
>
export type PublishedQuizResult = PublishedQuiz['results'][number]
export type DraftReviewStatus = v.InferOutput<typeof draftReviewStatusSchema>
export type DraftReviewSummary = {
  id: string
  quizId: string
  revisionNumber: number
  sourceKind: 'ai_generated' | 'manual_import' | 'seed_manifest'
  sourceIdentifier: string
  sourceModel: string | null
  reviewStatus: DraftReviewStatus
  title: string
  description: string
}

type StoredPublishedQuizSummaryRow = v.InferOutput<
  typeof storedPublishedQuizSummaryRowSchema
>
type StoredPublishedQuizRow = v.InferOutput<typeof storedPublishedQuizRowSchema>
type StoredDraftReviewRow = v.InferOutput<typeof storedDraftReviewRowSchema>
type NextRevisionRow = v.InferOutput<typeof nextRevisionRowSchema>

export type QuizRepository = {
  listPublished(): Promise<PublishedQuizSummary[]>
  readPublished(slug: string): Promise<PublishedQuiz | null>
  readPublishedResult(
    quizSlug: string,
    resultId: string,
  ): Promise<PublishedQuizResult | null>
  listDraftReviews(): Promise<DraftReviewSummary[]>
  ingestGeneratedDraft(input: unknown): Promise<DraftReviewSummary>
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
    async listDraftReviews() {
      return []
    },
    async ingestGeneratedDraft() {
      throw new Error('Generated draft ingestion requires a D1 database binding.')
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
    async listDraftReviews() {
      const rowResult = await database
        .prepare(
          `
            SELECT
              id,
              quiz_id,
              revision_number,
              source_kind,
              source_identifier,
              source_model,
              review_status,
              title,
              description
            FROM quiz_revisions
            WHERE status = 'draft'
              AND review_status IN ('generated', 'needs_review')
            ORDER BY updated_at DESC, revision_number DESC
          `,
        )
        .all<StoredDraftReviewRow>()

      return rowResult.results.map(parseStoredDraftReviewRow)
    },
    async ingestGeneratedDraft(input) {
      return ingestGeneratedDraft(database, input)
    },
  }
}

async function ingestGeneratedDraft(
  database: D1Database,
  input: unknown,
): Promise<DraftReviewSummary> {
  const draft = parseGeneratedQuizDraftInput(input)
  const quizId = quizDocumentId(draft.manifest.id)
  const nextRevisionNumber = await readNextRevisionNumber(database, quizId)
  const revisionId = quizRevisionId(quizId, nextRevisionNumber)
  const manifestJson = JSON.stringify(draft.manifest)

  await database.batch([
    database
      .prepare(
        `
          INSERT INTO quiz_documents (
            id,
            slug,
            created_at,
            updated_at
          )
          VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            slug = excluded.slug,
            updated_at = CURRENT_TIMESTAMP
        `,
      )
      .bind(quizId, draft.manifest.slug),
    database
      .prepare(
        `
          INSERT INTO quiz_revisions (
            id,
            quiz_id,
            revision_number,
            source_kind,
            source_identifier,
            source_model,
            source_prompt,
            source_metadata_json,
            status,
            review_status,
            title,
            description,
            manifest_json,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, 'ai_generated', ?, ?, ?, ?, 'draft', 'generated', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
      )
      .bind(
        revisionId,
        quizId,
        nextRevisionNumber,
        draft.source.identifier,
        draft.source.model,
        draft.source.prompt ?? null,
        draft.source.metadataJson ?? null,
        draft.manifest.title,
        draft.manifest.description,
        manifestJson,
      ),
    database.prepare('DELETE FROM published_quizzes WHERE quiz_id = ?').bind(quizId),
    database.prepare('DELETE FROM quiz_publications WHERE quiz_id = ?').bind(quizId),
  ])

  return {
    id: revisionId,
    quizId,
    revisionNumber: nextRevisionNumber,
    sourceKind: 'ai_generated',
    sourceIdentifier: draft.source.identifier,
    sourceModel: draft.source.model,
    reviewStatus: 'generated',
    title: draft.manifest.title,
    description: draft.manifest.description,
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

async function readNextRevisionNumber(
  database: D1Database,
  quizId: string,
): Promise<number> {
  const row = await database
    .prepare(
      `
        SELECT COALESCE(MAX(revision_number), 0) + 1 AS next_revision_number
        FROM quiz_revisions
        WHERE quiz_id = ?
      `,
    )
    .bind(quizId)
    .first<NextRevisionRow>()

  const result = v.safeParse(nextRevisionRowSchema, row)

  if (!result.success) {
    throw new Error(`Invalid next revision row.\n${v.summarize(result.issues)}`)
  }

  return result.output.next_revision_number
}

function quizDocumentId(quizId: string): string {
  return `quiz:${quizId}`
}

function quizRevisionId(quizId: string, revisionNumber: number): string {
  return `${quizId}:revision:${revisionNumber}`
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

function parseStoredDraftReviewRow(input: StoredDraftReviewRow): DraftReviewSummary {
  const result = v.safeParse(storedDraftReviewRowSchema, input)

  if (!result.success) {
    throw new Error(`Invalid draft review row.\n${v.summarize(result.issues)}`)
  }

  return {
    id: result.output.id,
    quizId: result.output.quiz_id,
    revisionNumber: result.output.revision_number,
    sourceKind: result.output.source_kind,
    sourceIdentifier: result.output.source_identifier,
    sourceModel: result.output.source_model,
    reviewStatus: result.output.review_status,
    title: result.output.title,
    description: result.output.description,
  }
}
