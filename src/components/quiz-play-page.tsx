'use client'

import { Link, useNavigate } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { QuizAnswerSelection } from '../lib/quiz-domain.ts'
import { createQuizAnalyticsTracker } from '../lib/quiz-analytics.ts'
import type { PublishedQuiz } from '../lib/quiz-repository.ts'
import { resolveQuizSubmission } from '../lib/quiz-service.ts'

function persistQuizSession(quizSlug: string, sessionId: string): void {
  try {
    window.sessionStorage.setItem(`justquizme-session:${quizSlug}`, sessionId)
  } catch {
    return
  }
}

export function QuizPlayPage({ quiz }: { quiz: PublishedQuiz }) {
  const navigate = useNavigate()
  const hasTrackedStartRef = useRef(false)
  const sessionIdRef = useRef<string | null>(null)
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<string, string>>({})
  const [clientError, setClientError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (hasTrackedStartRef.current) {
      return
    }

    hasTrackedStartRef.current = true
    const tracker = createQuizAnalyticsTracker({
      quizId: quiz.slug,
      quizSlug: quiz.slug,
      questionCount: quiz.questions.length,
      resultCount: quiz.results.length,
    })
    const startEvent = tracker.trackStart({ source: 'direct-link' })

    sessionIdRef.current = startEvent.sessionId
    void startEvent.delivery
  }, [quiz.questions.length, quiz.results.length, quiz.slug])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const answers = quiz.questions.map((question) => {
      const optionId = selectedOptionIds[question.id]

      return optionId
        ? {
            questionId: question.id,
            optionId,
          }
        : null
    })

    const missingQuestion = quiz.questions.find(
      (question) => typeof selectedOptionIds[question.id] !== 'string',
    )

    if (missingQuestion) {
      setClientError('Choose one answer for every question before seeing your result.')
      setServerError(null)
      return
    }

    setClientError(null)
    setServerError(null)
    setIsSubmitting(true)

    try {
      const tracker = createQuizAnalyticsTracker({
        quizId: quiz.slug,
        quizSlug: quiz.slug,
        questionCount: quiz.questions.length,
        resultCount: quiz.results.length,
      })
      let activeSessionId = sessionIdRef.current

      if (!activeSessionId) {
        const startEvent = tracker.trackStart({ source: 'unknown' })

        activeSessionId = startEvent.sessionId
        sessionIdRef.current = activeSessionId
        void startEvent.delivery
      }

      const resolution = await resolveQuizSubmission({
        data: {
          quizSlug: quiz.slug,
          answers: answers.filter(
            (answer): answer is QuizAnswerSelection => answer !== null,
          ),
        },
      })

      await tracker.trackSubmit({
        answerCount: resolution.answeredQuestionCount,
        resultId: resolution.resultId,
        sessionId: activeSessionId,
      })

      persistQuizSession(quiz.slug, activeSessionId)

      await navigate({
        to: '/quiz/$quizSlug/result',
        params: {
          quizSlug: quiz.slug,
        },
        search: {
          resultId: resolution.resultId,
          answered: resolution.answeredQuestionCount,
        },
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'We could not score that quiz right now. Please try again.'

      setServerError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <section className="w-full">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="eyebrow inline-flex items-center gap-2 no-underline transition-opacity hover:opacity-75"
          >
            <span aria-hidden="true">←</span>
            <span>Back home</span>
          </Link>

          <header className="mt-7 border-y border-[color:var(--rule)] py-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <p className="eyebrow">Quiz</p>
              <p className="text-sm leading-6 text-[var(--muted)]">
                {quiz.questions.length} questions, {quiz.results.length} possible results.
              </p>
            </div>
            <h1 className="display-type mt-4 text-4xl leading-[0.96] tracking-[-0.045em] text-[var(--ink)] sm:text-5xl">
              {quiz.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              {quiz.description}
            </p>
          </header>

          <form className="mt-9 space-y-8" method="get" onSubmit={handleSubmit}>
            {quiz.questions.map((question, questionIndex) => (
              <fieldset
                key={question.id}
                className="grid gap-4 border-t border-[color:var(--rule)] pt-6 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_minmax(0,1fr)]"
              >
                <legend className="sr-only">{question.prompt}</legend>
                <p className="eyebrow pt-1">Q{String(questionIndex + 1).padStart(2, '0')}</p>

                <div>
                  <h2 className="text-xl font-semibold leading-7 text-[var(--ink)] sm:text-2xl">
                    {question.prompt}
                  </h2>

                  <div className="mt-4">
                    {question.options.map((option) => {
                      const isSelected = selectedOptionIds[question.id] === option.id

                      return (
                        <label
                          key={option.id}
                          className={
                            isSelected
                              ? 'answer-choice answer-choice--selected'
                              : 'answer-choice'
                          }
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.id}
                            checked={isSelected}
                            onChange={() => {
                              setSelectedOptionIds((current) => ({
                                ...current,
                                [question.id]: option.id,
                              }))
                            }}
                            className="h-5 w-5 shrink-0 cursor-pointer accent-[color:var(--accent)]"
                          />
                          <span className="text-base leading-7 text-[var(--ink)]">
                            {option.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </fieldset>
            ))}

            {clientError ? (
              <p className="rounded-2xl border border-[color:var(--warning-rule)] bg-[color:var(--warning-soft)] px-4 py-3 text-sm leading-6 text-[var(--ink)]">
                {clientError}
              </p>
            ) : null}

            {serverError ? (
              <p className="rounded-2xl border border-[color:var(--warning-rule)] bg-[color:var(--warning-soft)] px-4 py-3 text-sm leading-6 text-[var(--ink)]">
                {serverError}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-[color:var(--rule)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[var(--muted)]">
                {quiz.questions.length} questions. No saved attempts. Just a
                fast answer, a ridiculous result, and the chance to send it to
                someone immediately.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary"
              >
                {isSubmitting ? 'Scoring your result...' : 'See my result'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
