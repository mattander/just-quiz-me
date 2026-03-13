export type AnalyticsEventPayloadMap = {
  quiz_started: {
    quizId: string
    quizSlug: string
    questionCount: number
    resultCount: number
    sessionId: string
    source: string
  }
  quiz_submitted: {
    quizId: string
    quizSlug: string
    answerCount: number
    resultId: string
    sessionId: string
  }
  quiz_result_viewed: {
    quizId: string
    quizSlug: string
    resultId: string
    sessionId: string
  }
  quiz_share_clicked: {
    quizId: string
    quizSlug: string
    resultId: string
    sessionId: string
    target: string
  }
}

export type AnalyticsEventName = keyof AnalyticsEventPayloadMap

export type AnalyticsEvent<Name extends AnalyticsEventName = AnalyticsEventName> = {
  name: Name
  payload: AnalyticsEventPayloadMap[Name]
  timestamp: string
}

export interface AnalyticsAdapter {
  trackEvent<Name extends AnalyticsEventName>(
    event: AnalyticsEvent<Name>,
  ): void | Promise<void>
}

export const browserAnalyticsEventName = 'justquizme:analytics'

function createAnalyticsEvent<Name extends AnalyticsEventName>(
  name: Name,
  payload: AnalyticsEventPayloadMap[Name],
): AnalyticsEvent<Name> {
  return {
    name,
    payload,
    timestamp: new Date().toISOString(),
  }
}

function dispatchBrowserAnalyticsEvent(
  event: AnalyticsEvent,
): void {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent<AnalyticsEvent>(browserAnalyticsEventName, {
      detail: event,
    }),
  )
}

export function createBrowserAnalyticsAdapter(): AnalyticsAdapter {
  return {
    trackEvent(event) {
      dispatchBrowserAnalyticsEvent(event)
    },
  }
}

export const browserAnalyticsAdapter = createBrowserAnalyticsAdapter()

export function trackAnalyticsEvent<Name extends AnalyticsEventName>(
  name: Name,
  payload: AnalyticsEventPayloadMap[Name],
  adapter: AnalyticsAdapter = browserAnalyticsAdapter,
): void | Promise<void> {
  return adapter.trackEvent(createAnalyticsEvent(name, payload))
}
