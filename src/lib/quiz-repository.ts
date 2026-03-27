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
  revision_id: quizIdentifierSchema,
  slug: quizIdentifierSchema,
  title: v.pipe(v.string(), v.trim(), v.minLength(1)),
  description: v.pipe(v.string(), v.trim(), v.minLength(1)),
})

const storedQuizResultRowSchema = v.object({
  result_key: quizIdentifierSchema,
  title: v.pipe(v.string(), v.trim(), v.minLength(1)),
  description: v.pipe(v.string(), v.trim(), v.minLength(1)),
})

const storedQuizQuestionOptionWeightRowSchema = v.object({
  question_key: quizIdentifierSchema,
  prompt: v.pipe(v.string(), v.trim(), v.minLength(1)),
  option_key: quizIdentifierSchema,
  label: v.pipe(v.string(), v.trim(), v.minLength(1)),
  result_key: quizIdentifierSchema,
  weight: v.pipe(
    v.number(),
    v.integer('Weight values must be whole numbers.'),
    v.minValue(1, 'Weight values must be positive.'),
  ),
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
type StoredQuizResultRow = v.InferOutput<typeof storedQuizResultRowSchema>
type StoredQuizQuestionOptionWeightRow = v.InferOutput<
  typeof storedQuizQuestionOptionWeightRowSchema
>

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
            SELECT
              published_quiz_revisions.slug AS slug,
              quiz_revisions.title,
              quiz_revisions.description
            FROM published_quiz_revisions
            INNER JOIN quiz_revisions
              ON quiz_revisions.id = published_quiz_revisions.quiz_revision_id
            ORDER BY published_quiz_revisions.slug ASC
          `,
        )
        .all<StoredPublishedQuizSummaryRow>()

      return rowResult.results.map(parseStoredPublishedQuizSummaryRow)
    },
    async readPublished(slug) {
      const quizRow = await database
        .prepare(
          `
            SELECT
              quiz_revisions.id AS revision_id,
              published_quiz_revisions.slug,
              title,
              description
            FROM published_quiz_revisions
            INNER JOIN quiz_revisions
              ON quiz_revisions.id = published_quiz_revisions.quiz_revision_id
            WHERE published_quiz_revisions.slug = ?
            LIMIT 1
          `,
        )
        .bind(slug)
        .first<StoredPublishedQuizRow>()

      if (!quizRow) {
        return null
      }

      const storedQuiz = parseStoredPublishedQuizRow(quizRow)
      const resultRows = await database
        .prepare(
          `
            SELECT result_key, title, description
            FROM quiz_revision_results
            WHERE quiz_revision_id = ?
            ORDER BY position ASC
          `,
        )
        .bind(storedQuiz.revision_id)
        .all<StoredQuizResultRow>()
      const questionOptionWeightRows = await database
        .prepare(
          `
            SELECT
              quiz_questions.question_key,
              quiz_questions.prompt,
              quiz_options.option_key,
              quiz_options.label,
              quiz_results.result_key,
              quiz_option_weights.weight
            FROM quiz_revision_questions AS quiz_questions
            INNER JOIN quiz_revision_options AS quiz_options
              ON quiz_options.question_id = quiz_questions.id
            INNER JOIN quiz_revision_option_weights AS quiz_option_weights
              ON quiz_option_weights.option_id = quiz_options.id
            INNER JOIN quiz_revision_results AS quiz_results
              ON quiz_results.id = quiz_option_weights.result_id
            WHERE quiz_questions.quiz_revision_id = ?
            ORDER BY
              quiz_questions.position ASC,
              quiz_options.position ASC,
              quiz_results.position ASC
          `,
        )
        .bind(storedQuiz.revision_id)
        .all<StoredQuizQuestionOptionWeightRow>()

      const manifest = parseQuizManifest({
        id: storedQuiz.slug,
        slug: storedQuiz.slug,
        status: 'published',
        title: storedQuiz.title,
        description: storedQuiz.description,
        results: resultRows.results.map((row) => {
          const storedResult = parseStoredQuizResultRow(row)

          return {
            id: storedResult.result_key,
            title: storedResult.title,
            description: storedResult.description,
          }
        }),
        questions: buildQuestions(questionOptionWeightRows.results),
      })

      return toPublishedQuiz(manifest)
    },
    async readPublishedResult(quizSlug, resultId) {
      const resultRow = await database
        .prepare(
          `
            SELECT
              quiz_results.result_key,
              quiz_results.title,
              quiz_results.description
            FROM published_quiz_revisions
            INNER JOIN quiz_revisions
              ON quiz_revisions.id = published_quiz_revisions.quiz_revision_id
            INNER JOIN quiz_revision_results AS quiz_results
              ON quiz_results.quiz_revision_id = quiz_revisions.id
            WHERE
              published_quiz_revisions.slug = ?
              AND quiz_results.result_key = ?
            LIMIT 1
          `,
        )
        .bind(quizSlug, resultId)
        .first<StoredQuizResultRow>()

      if (!resultRow) {
        return null
      }

      const storedResult = parseStoredQuizResultRow(resultRow)

      return {
        id: storedResult.result_key,
        title: storedResult.title,
        description: storedResult.description,
      }
    },
  }
}

function buildQuestions(
  rows: StoredQuizQuestionOptionWeightRow[],
): PublishedQuiz['questions'] {
  const questions = new Map<
    string,
    {
      id: string
      prompt: string
      options: Array<{
        id: string
        label: string
        weights: Array<{ resultId: string; value: number }>
      }>
      optionIndex: Map<string, number>
    }
  >()

  for (const row of rows) {
    const storedRow = parseStoredQuizQuestionOptionWeightRow(row)
    let question = questions.get(storedRow.question_key)

    if (!question) {
      question = {
        id: storedRow.question_key,
        prompt: storedRow.prompt,
        options: [],
        optionIndex: new Map(),
      }
      questions.set(storedRow.question_key, question)
    }

    const existingOptionIndex = question.optionIndex.get(storedRow.option_key)

    if (existingOptionIndex === undefined) {
      question.optionIndex.set(storedRow.option_key, question.options.length)
      question.options.push({
        id: storedRow.option_key,
        label: storedRow.label,
        weights: [{ resultId: storedRow.result_key, value: storedRow.weight }],
      })
      continue
    }

    question.options[existingOptionIndex].weights.push({
      resultId: storedRow.result_key,
      value: storedRow.weight,
    })
  }

  return Array.from(questions.values()).map(({ id, prompt, options }) => ({
    id,
    prompt,
    options,
  }))
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

function parseStoredQuizResultRow(input: StoredQuizResultRow): StoredQuizResultRow {
  const result = v.safeParse(storedQuizResultRowSchema, input)

  if (!result.success) {
    throw new Error(`Invalid quiz result row.\n${v.summarize(result.issues)}`)
  }

  return result.output
}

function parseStoredQuizQuestionOptionWeightRow(
  input: StoredQuizQuestionOptionWeightRow,
): StoredQuizQuestionOptionWeightRow {
  const result = v.safeParse(storedQuizQuestionOptionWeightRowSchema, input)

  if (!result.success) {
    throw new Error(
      `Invalid quiz question option weight row.\n${v.summarize(result.issues)}`,
    )
  }

  return result.output
}
