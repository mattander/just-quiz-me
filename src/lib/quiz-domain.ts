import type { AppSettings } from './app-settings.ts'
import type { QuizManifest } from './quiz-manifest.ts'

export type QuizAnswerSelection = {
  questionId: string
  optionId: string
}

export type HomepageQuizFeed = {
  featuredQuiz: QuizManifest | null
  quizzes: QuizManifest[]
}

export type QuizResultScore = {
  resultId: string
  title: string
  description: string
  score: number
  rank: number
  tiedResultIds: string[]
}

export type QuizScoreOutcome = {
  quizId: string
  quizSlug: string
  winningResult: QuizResultScore
  results: QuizResultScore[]
  answeredQuestionCount: number
}

export function isPublishedQuiz(manifest: QuizManifest): boolean {
  return manifest.status === 'published'
}

export function listPublishedQuizzes(
  manifests: readonly QuizManifest[],
): QuizManifest[] {
  return manifests.filter(isPublishedQuiz)
}

export function getPublishedQuizBySlug(
  manifests: readonly QuizManifest[],
  slug: string,
): QuizManifest | null {
  return listPublishedQuizzes(manifests).find((manifest) => manifest.slug === slug) ?? null
}

export function buildHomepageQuizFeed(
  manifests: readonly QuizManifest[],
  settings: AppSettings,
  limit?: number,
): HomepageQuizFeed {
  const publishedQuizzes = listPublishedQuizzes(manifests)

  if (publishedQuizzes.length === 0) {
    return {
      featuredQuiz: null,
      quizzes: [],
    }
  }

  const featuredQuiz =
    publishedQuizzes.find((manifest) => manifest.slug === settings.featuredQuizSlug) ??
    publishedQuizzes[0]

  const feedQuizzes = publishedQuizzes.filter(
    (manifest) => manifest.slug !== featuredQuiz.slug,
  )
  const limitedFeed =
    typeof limit === 'number' && limit >= 0 ? feedQuizzes.slice(0, limit) : feedQuizzes

  return {
    featuredQuiz,
    quizzes: limitedFeed,
  }
}

export function scoreQuizAnswers(
  manifest: QuizManifest,
  answers: readonly QuizAnswerSelection[],
): QuizScoreOutcome {
  const knownQuestionIds = new Set(manifest.questions.map((question) => question.id))

  for (const answer of answers) {
    if (!knownQuestionIds.has(answer.questionId)) {
      throw new Error(`Answer references unknown question "${answer.questionId}".`)
    }
  }

  const optionSelectionsByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer.optionId]),
  )

  if (optionSelectionsByQuestionId.size !== answers.length) {
    throw new Error('Quiz answers must include at most one option per question.')
  }

  const scoresByResultId = new Map(manifest.results.map((result) => [result.id, 0]))

  for (const question of manifest.questions) {
    const selectedOptionId = optionSelectionsByQuestionId.get(question.id)

    if (!selectedOptionId) {
      continue
    }

    const option = question.options.find(
      (currentOption) => currentOption.id === selectedOptionId,
    )

    if (!option) {
      throw new Error(
        `Answer "${selectedOptionId}" does not exist on question "${question.id}".`,
      )
    }

    for (const weight of option.weights) {
      const currentScore = scoresByResultId.get(weight.resultId)

      if (typeof currentScore !== 'number') {
        throw new Error(
          `Answer "${selectedOptionId}" references unknown result "${weight.resultId}".`,
        )
      }

      scoresByResultId.set(weight.resultId, currentScore + weight.value)
    }
  }

  const rankingSeed = manifest.results.map((result, index) => ({
    resultId: result.id,
    title: result.title,
    description: result.description,
    score: scoresByResultId.get(result.id) ?? 0,
    order: index,
  }))

  const rankedResults = rankingSeed
    .slice()
    .sort((left, right) => right.score - left.score || left.order - right.order)

  const results = rankedResults.map((result, index) => {
    const tiedResultIds = rankedResults
      .filter((candidate) => candidate.score === result.score)
      .map((candidate) => candidate.resultId)

    return {
      resultId: result.resultId,
      title: result.title,
      description: result.description,
      score: result.score,
      rank: index + 1,
      tiedResultIds,
    }
  })

  const winningResult = results[0]

  if (!winningResult) {
    throw new Error(`Quiz "${manifest.id}" cannot be scored without configured results.`)
  }

  return {
    quizId: manifest.id,
    quizSlug: manifest.slug,
    winningResult,
    results,
    answeredQuestionCount: optionSelectionsByQuestionId.size,
  }
}
