import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
  useChildMatches,
  useNavigate,
} from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { QuizAnswerSelection } from '../lib/quiz-domain.ts'
import { getRuntimeConfig } from '../lib/runtime-config.ts'
import { readPublishedQuiz, resolveQuizSubmission } from '../lib/quiz-service.ts'
import {
  buildAbsoluteUrl,
  createCanonicalLinks,
  createPageMetadata,
} from '../lib/seo.ts'

export const Route = createFileRoute('/quiz/$quizSlug')({
  loader: async ({ params }) => {
    const [quiz, runtimeConfig] = await Promise.all([
      readPublishedQuiz({
        data: {
          quizSlug: params.quizSlug,
        },
      }),
      getRuntimeConfig(),
    ])

    if (!quiz) {
      throw notFound()
    }

    return {
      quiz,
      siteUrl: runtimeConfig.publicSiteUrl,
    }
  },
  head: ({ loaderData, match, matches }) => {
    if (!loaderData) {
      return {}
    }

    const leafMatch = matches[matches.length - 1]

    if (!leafMatch || leafMatch.id !== match.id) {
      return {}
    }

    const canonicalUrl = buildAbsoluteUrl(
      loaderData.siteUrl,
      `/quiz/${loaderData.quiz.slug}`,
    )

    return {
      meta: createPageMetadata({
        title: `${loaderData.quiz.title} | Just Quiz Me`,
        description: loaderData.quiz.description,
        canonicalUrl,
      }),
      links: createCanonicalLinks(canonicalUrl),
    }
  },
  component: QuizRouteShell,
})

function QuizRouteShell() {
  const childMatches = useChildMatches()

  if (childMatches.length > 0) {
    return <Outlet />
  }

  return <QuizPlayPage />
}

function QuizPlayPage() {
  const { quiz } = Route.useLoaderData()
  const navigate = useNavigate()
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<string, string>>({})
  const [clientError, setClientError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      const resolution = await resolveQuizSubmission({
        data: {
          quizSlug: quiz.slug,
          answers: answers.filter(
            (answer): answer is QuizAnswerSelection => answer !== null,
          ),
        },
      })

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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass-panel w-full rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="eyebrow inline-flex items-center gap-2 no-underline transition-opacity hover:opacity-75"
          >
            <span aria-hidden="true">←</span>
            <span>Back home</span>
          </Link>

          <header className="mt-6">
            <p className="eyebrow">Play quiz</p>
            <h1 className="display-type mt-3 text-4xl leading-[0.96] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
              {quiz.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              {quiz.description}
            </p>
          </header>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            {quiz.questions.map((question, questionIndex) => (
              <fieldset
                key={question.id}
                className="glass-panel-soft rounded-[1.5rem] p-5 sm:p-6"
              >
                <legend className="sr-only">{question.prompt}</legend>
                <p className="eyebrow">Question {questionIndex + 1}</p>
                <h2 className="mt-2 text-xl font-semibold leading-7 text-[var(--ink)] sm:text-2xl">
                  {question.prompt}
                </h2>

                <div className="mt-5 space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selectedOptionIds[question.id] === option.id

                    return (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-start gap-3 rounded-[1.2rem] border border-[color:var(--panel-border)] bg-white/45 p-4 transition hover:border-[color:var(--accent-teal)] hover:bg-white/65 dark:bg-black/10 dark:hover:bg-black/20"
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
                          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[color:var(--accent-teal)]"
                        />
                        <span className="text-base leading-7 text-[var(--ink)]">
                          {option.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}

            {clientError ? (
              <p className="rounded-2xl border border-[color:var(--accent-coral)]/35 bg-[color:var(--accent-coral)]/10 px-4 py-3 text-sm leading-6 text-[var(--ink)]">
                {clientError}
              </p>
            ) : null}

            {serverError ? (
              <p className="rounded-2xl border border-[color:var(--accent-coral)]/35 bg-[color:var(--accent-coral)]/10 px-4 py-3 text-sm leading-6 text-[var(--ink)]">
                {serverError}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-[color:var(--panel-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[var(--muted)]">
                {quiz.questions.length} questions. No saved attempts. Just vibes and immediate consequences.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
