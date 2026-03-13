import type { QuizManifest } from './quiz-manifest.ts'
import type { AnalyticsAdapter } from './analytics.ts'
import { browserAnalyticsAdapter, trackAnalyticsEvent } from './analytics.ts'

export type QuizStartSource =
  | 'direct-link'
  | 'featured-quiz'
  | 'homepage'
  | 'quiz-index'
  | 'unknown'

export type QuizShareTarget =
  | 'copy-link'
  | 'native-share'
  | 'x'
  | 'facebook'
  | 'unknown'

export type QuizAnalyticsContext = {
  quizId: string
  quizSlug: string
  questionCount: number
  resultCount: number
}

export type QuizStartEventInput = {
  sessionId?: string
  source: QuizStartSource
}

export type QuizSubmitEventInput = {
  answerCount: number
  resultId: string
  sessionId: string
}

export type QuizResultViewEventInput = {
  resultId: string
  sessionId: string
}

export type QuizShareClickEventInput = {
  resultId: string
  sessionId: string
  target: QuizShareTarget
}

export type QuizAnalyticsTracker = {
  trackStart(input: QuizStartEventInput): QuizStartEventResult
  trackSubmit(input: QuizSubmitEventInput): void | Promise<void>
  trackResultView(input: QuizResultViewEventInput): void | Promise<void>
  trackShareClick(input: QuizShareClickEventInput): void | Promise<void>
}

export type QuizStartEventResult = {
  sessionId: string
  delivery: void | Promise<void>
}

function createQuizAnalyticsContext(
  manifest: Pick<QuizManifest, 'id' | 'slug' | 'questions' | 'results'>,
): QuizAnalyticsContext {
  return {
    quizId: manifest.id,
    quizSlug: manifest.slug,
    questionCount: manifest.questions.length,
    resultCount: manifest.results.length,
  }
}

function createSessionId(): string {
  return crypto.randomUUID()
}

export function createQuizAnalyticsTracker(
  context: QuizAnalyticsContext,
  adapter: AnalyticsAdapter = browserAnalyticsAdapter,
): QuizAnalyticsTracker {
  return {
    trackStart(input) {
      const sessionId = input.sessionId ?? createSessionId()

      const delivery = trackAnalyticsEvent(
        'quiz_started',
        {
          quizId: context.quizId,
          quizSlug: context.quizSlug,
          questionCount: context.questionCount,
          resultCount: context.resultCount,
          sessionId,
          source: input.source,
        },
        adapter,
      )

      return { sessionId, delivery }
    },
    trackSubmit(input) {
      return trackAnalyticsEvent(
        'quiz_submitted',
        {
          quizId: context.quizId,
          quizSlug: context.quizSlug,
          answerCount: input.answerCount,
          resultId: input.resultId,
          sessionId: input.sessionId,
        },
        adapter,
      )
    },
    trackResultView(input) {
      return trackAnalyticsEvent(
        'quiz_result_viewed',
        {
          quizId: context.quizId,
          quizSlug: context.quizSlug,
          resultId: input.resultId,
          sessionId: input.sessionId,
        },
        adapter,
      )
    },
    trackShareClick(input) {
      return trackAnalyticsEvent(
        'quiz_share_clicked',
        {
          quizId: context.quizId,
          quizSlug: context.quizSlug,
          resultId: input.resultId,
          sessionId: input.sessionId,
          target: input.target,
        },
        adapter,
      )
    },
  }
}

export function createQuizAnalyticsTrackerFromManifest(
  manifest: Pick<QuizManifest, 'id' | 'slug' | 'questions' | 'results'>,
  adapter?: AnalyticsAdapter,
): QuizAnalyticsTracker {
  return createQuizAnalyticsTracker(createQuizAnalyticsContext(manifest), adapter)
}
