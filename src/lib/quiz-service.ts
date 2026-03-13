import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import { createQuizRepository } from './quiz-repository.ts'
import { getAppRequestContext } from './server-context.ts'
import {
  resolveCompletedQuizAnswers,
  type QuizAnswerSelection,
} from './quiz-domain.ts'

const quizSlugSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Quiz slug is required.'),
)

const answerSelectionSchema = v.object({
  questionId: v.pipe(v.string(), v.trim(), v.minLength(1, 'Question id is required.')),
  optionId: v.pipe(v.string(), v.trim(), v.minLength(1, 'Option id is required.')),
})

const readPublishedQuizInputSchema = v.object({
  quizSlug: quizSlugSchema,
})

const resolveQuizSubmissionInputSchema = v.object({
  quizSlug: quizSlugSchema,
  answers: v.pipe(
    v.array(answerSelectionSchema),
    v.minLength(1, 'At least one answer is required to score a quiz.'),
  ),
})

const quizResultSearchSchema = v.object({
  resultId: v.pipe(v.string(), v.trim(), v.minLength(1, 'Result id is required.')),
  answered: v.pipe(
    v.union([
      v.number(),
      v.pipe(
        v.string(),
        v.trim(),
        v.regex(/^\d+$/, 'Answered question count must be numeric.'),
        v.transform((value) => Number.parseInt(value, 10)),
      ),
    ]),
    v.integer('Answered question count must be a whole number.'),
    v.minValue(1, 'Answered question count must be positive.'),
  ),
})

export type ReadPublishedQuizInput = v.InferOutput<
  typeof readPublishedQuizInputSchema
>
export type ResolveQuizSubmissionInput = v.InferOutput<
  typeof resolveQuizSubmissionInputSchema
>
export type QuizResultSearch = v.InferOutput<typeof quizResultSearchSchema>

function parseReadPublishedQuizInput(input: unknown): ReadPublishedQuizInput {
  return v.parse(readPublishedQuizInputSchema, input)
}

function parseResolveQuizSubmissionInput(
  input: unknown,
): ResolveQuizSubmissionInput {
  return v.parse(resolveQuizSubmissionInputSchema, input)
}

export function parseQuizResultSearch(input: unknown): QuizResultSearch {
  return v.parse(quizResultSearchSchema, input)
}

export const readPublishedQuiz = createServerFn({ method: 'GET' })
  .inputValidator(parseReadPublishedQuizInput)
  .handler(async ({ context, data }) => {
    const requestContext = getAppRequestContext(context)
    const repository = createQuizRepository(
      requestContext.cloudflare.bindings.QUIZ_DB,
    )

    return repository.readPublished(data.quizSlug)
  })

export const resolveQuizSubmission = createServerFn({ method: 'POST' })
  .inputValidator(parseResolveQuizSubmissionInput)
  .handler(async ({ context, data }) => {
    const requestContext = getAppRequestContext(context)
    const repository = createQuizRepository(
      requestContext.cloudflare.bindings.QUIZ_DB,
    )
    const quiz = await repository.readPublished(data.quizSlug)

    if (!quiz) {
      throw new Error(`Published quiz "${data.quizSlug}" was not found.`)
    }

    const outcome = resolveCompletedQuizAnswers(
      quiz,
      data.answers satisfies readonly QuizAnswerSelection[],
    )

    return {
      quizSlug: data.quizSlug,
      resultId: outcome.winningResult.resultId,
      answeredQuestionCount: outcome.answeredQuestionCount,
    }
  })
