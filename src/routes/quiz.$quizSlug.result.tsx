import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ResultShareActions } from '../components/result-share-actions.tsx'
import { getResultEnhancement } from '../content/result-enhancements.ts'
import { getRuntimeConfig } from '../lib/runtime-config.ts'
import {
  buildAbsoluteUrl,
  createCanonicalLinks,
  createPageMetadata,
} from '../lib/seo.ts'
import { parseQuizResultSearch, readPublishedQuiz } from '../lib/quiz-service.ts'

export const Route = createFileRoute('/quiz/$quizSlug/result')({
  validateSearch: parseQuizResultSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
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

    const result = quiz.results.find((entry) => entry.id === deps.resultId)

    if (!result) {
      throw notFound()
    }

    return {
      quiz,
      result,
      resultEnhancement: getResultEnhancement(quiz.slug, result.id),
      answeredQuestionCount: deps.answered,
      sessionId: deps.sessionId,
      siteUrl: runtimeConfig.publicSiteUrl,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {}
    }

    const canonicalUrl = buildAbsoluteUrl(
      loaderData.siteUrl,
      `/quiz/${loaderData.quiz.slug}/result`,
      new URLSearchParams({
        resultId: loaderData.result.id,
        answered: String(loaderData.answeredQuestionCount),
      }),
    )

    return {
      meta: createPageMetadata({
        title: `${loaderData.result.title} | ${loaderData.quiz.title} | Just Quiz Me`,
        description: loaderData.resultEnhancement.shareText,
        canonicalUrl,
        pageType: 'article',
        robots: 'noindex,follow',
      }),
      links: createCanonicalLinks(canonicalUrl),
    }
  },
  component: QuizResultPage,
})

function QuizResultPage() {
  const {
    quiz,
    result,
    resultEnhancement,
    answeredQuestionCount,
    sessionId,
    siteUrl,
  } = Route.useLoaderData()
  const shareUrl = buildAbsoluteUrl(
    siteUrl,
    `/quiz/${quiz.slug}/result`,
    new URLSearchParams({
      resultId: result.id,
      answered: String(answeredQuestionCount),
    }),
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <section className="w-full">
        <div className="mx-auto max-w-3xl">
          <header className="border-y border-[color:var(--rule)] py-7">
            <p className="eyebrow">Your result</p>
            <h1 className="display-type mt-4 text-5xl leading-[0.94] tracking-[-0.055em] text-[var(--ink)] sm:text-6xl">
              {result.title}
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              {result.description}
            </p>
          </header>

          <div className="result-panel mt-8">
            <p className="eyebrow">The read</p>
            <p className="mt-3 text-base leading-8 text-[var(--ink)] sm:text-lg">
              {resultEnhancement.detail}
            </p>
          </div>

          <ResultShareActions
            quizSlug={quiz.slug}
            questionCount={quiz.questions.length}
            resultCount={quiz.results.length}
            resultId={result.id}
            resultTitle={result.title}
            shareText={resultEnhancement.shareText}
            shareUrl={shareUrl}
            sessionId={sessionId}
          />

          <div className="mt-8 border-t border-[color:var(--rule)] pt-6">
            <p className="eyebrow">From</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">{quiz.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">
              You answered {answeredQuestionCount} of {quiz.questions.length} questions in
              this round. Attempts are not stored, so every replay starts fresh.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/quiz/$quizSlug"
              params={{
                quizSlug: quiz.slug,
              }}
              className="button-primary"
            >
              Play again
            </Link>
            <Link
              to="/"
              className="button-secondary"
            >
              Pick another quiz
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
