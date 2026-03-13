import { Link, createFileRoute, notFound } from '@tanstack/react-router'
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
      answeredQuestionCount: deps.answered,
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
        description: loaderData.result.description,
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
  const { quiz, result, answeredQuestionCount } = Route.useLoaderData()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass-panel w-full rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Your result</p>
          <h1 className="display-type mt-3 text-4xl leading-[0.96] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
            {result.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:text-lg">
            {result.description}
          </p>

          <div className="glass-panel-soft mt-8 rounded-[1.5rem] p-5 sm:p-6">
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
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-white no-underline transition hover:opacity-90"
            >
              Play again
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--panel-border)] px-6 py-3 text-sm font-semibold text-[var(--ink)] no-underline transition hover:bg-white/35 dark:hover:bg-black/10"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
