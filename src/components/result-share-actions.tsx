'use client'

import { useEffect, useState } from 'react'
import { createQuizAnalyticsTracker } from '../lib/quiz-analytics.ts'

type ResultShareActionsProps = {
  quizSlug: string
  questionCount: number
  resultCount: number
  resultId: string
  resultTitle: string
  shareText: string
  shareUrl: string
  sessionId?: string
}

function readStoredSessionId(quizSlug: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.sessionStorage.getItem(`justquizme-session:${quizSlug}`)
  } catch {
    return null
  }
}

export function ResultShareActions({
  quizSlug,
  questionCount,
  resultCount,
  resultId,
  resultTitle,
  shareText,
  shareUrl,
  sessionId,
}: ResultShareActionsProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [activeSessionId] = useState(
    () => sessionId ?? readStoredSessionId(quizSlug) ?? 'shared-result',
  )

  useEffect(() => {
    const tracker = createQuizAnalyticsTracker({
      quizId: quizSlug,
      quizSlug,
      questionCount,
      resultCount,
    })

    void tracker.trackResultView({
      resultId,
      sessionId: activeSessionId,
    })
  }, [activeSessionId, questionCount, quizSlug, resultCount, resultId])

  async function handleShareClick() {
    const tracker = createQuizAnalyticsTracker({
      quizId: quizSlug,
      quizSlug,
      questionCount,
      resultCount,
    })

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${resultTitle} | Just Quiz Me`,
          text: shareText,
          url: shareUrl,
        })

        setStatusMessage('Shared.')
        await tracker.trackShareClick({
          resultId,
          sessionId: activeSessionId,
          target: 'native-share',
        })
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setStatusMessage('Copied result link.')
      await tracker.trackShareClick({
        resultId,
        sessionId: activeSessionId,
        target: 'copy-link',
      })
    } catch {
      setStatusMessage('Sharing did not finish. You can try again or copy the address bar.')
    }
  }

  return (
    <div className="mt-8 border-t border-[color:var(--rule)] pt-6">
      <p className="eyebrow">Send it</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="button-primary"
          onClick={() => {
            void handleShareClick()
          }}
        >
          Share this result
        </button>
        <p className="text-sm leading-6 text-[var(--muted)]" aria-live="polite">
          {statusMessage ?? 'Copy the result or use your device share sheet.'}
        </p>
      </div>
    </div>
  )
}
