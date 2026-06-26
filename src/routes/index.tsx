import { Link, createFileRoute } from '@tanstack/react-router'
import { getAppSettings } from '../lib/app-settings-service.ts'
import { getRuntimeConfig } from '../lib/runtime-config.ts'
import {
  listPublishedQuizzes,
  type PublishedQuizSummary,
} from '../lib/quiz-service.ts'
import {
  buildAbsoluteUrl,
  createCanonicalLinks,
  createPageMetadata,
} from '../lib/seo.ts'

type HomePageFeed = {
  featuredQuiz: PublishedQuizSummary | null
  moreQuizzes: PublishedQuizSummary[]
  quizCount: number
}

export const Route = createFileRoute('/')({
  loader: async () => {
    const [settings, publishedQuizzes, runtimeConfig] = await Promise.all([
      getAppSettings(),
      listPublishedQuizzes(),
      getRuntimeConfig(),
    ])

    return {
      feed: buildHomePageFeed(publishedQuizzes, settings.featuredQuizSlug),
      siteUrl: runtimeConfig.publicSiteUrl,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {}
    }

    const canonicalUrl = buildAbsoluteUrl(loaderData.siteUrl, '/')

    return {
      meta: createPageMetadata({
        title: 'Just Quiz Me | Weird little quizzes for your group chat',
        description:
          'Answer a few ridiculous questions, get a strangely specific result, and send it to someone who will regret laughing at it.',
        canonicalUrl,
      }),
      links: createCanonicalLinks(canonicalUrl),
    }
  },
  component: HomePage,
})

function HomePage() {
  const { feed } = Route.useLoaderData()
  const { featuredQuiz, moreQuizzes } = feed

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
      <div className="w-full">
        <section className="grid gap-10 border-y border-[color:var(--rule)] py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-3" aria-label="Just Quiz Me">
              <img
                src="/logo.svg"
                alt=""
                width="48"
                height="48"
                className="theme-logo-mark theme-logo-mark--light h-12 w-12"
              />
              <img
                src="/logo-dark.svg"
                alt=""
                width="48"
                height="48"
                className="theme-logo-mark theme-logo-mark--dark h-12 w-12"
              />
              <span className="display-type text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
                Just Quiz Me
              </span>
            </div>
            <h1 className="display-type mt-5 max-w-4xl text-5xl leading-[0.92] tracking-[-0.055em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
              Small, strange quizzes for people avoiding the group chat correctly.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Pick a short quiz, answer four suspiciously specific questions,
              and get a result that feels rude enough to send but harmless enough
              to survive the reply thread.
            </p>
          </div>

          <aside className="quiz-register lg:mt-2">
            <p className="eyebrow">Current shelf</p>
            <p className="display-type mt-3 text-5xl leading-none tracking-[-0.05em] text-[var(--ink)]">
              {feed.quizCount}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Live quizzes. No accounts, no saved attempts, no suspiciously long
              onboarding flow.
            </p>
          </aside>
        </section>

        {featuredQuiz ? (
          <section className="mt-10 sm:mt-14">
            <div className="featured-quiz grid gap-7 border-y border-[color:var(--rule)] py-7 lg:grid-cols-[8rem_minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="eyebrow">Start here</p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Lead quiz from the shelf.
                </p>
              </div>
              <div className="max-w-3xl">
                <h2 className="display-type text-4xl leading-[0.98] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                  {featuredQuiz.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
                  {featuredQuiz.description}
                </p>
              </div>

              <Link
                to="/quiz/$quizSlug"
                params={{
                  quizSlug: featuredQuiz.slug,
                }}
                className="button-primary"
              >
                Play this quiz
              </Link>
            </div>
          </section>
        ) : null}

        {moreQuizzes.length > 0 ? (
          <section className="mt-12 sm:mt-16">
            <div className="grid gap-5 border-b border-[color:var(--rule)] pb-5 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,28rem)] sm:items-end">
              <div>
                <p className="eyebrow">Quiz shelf</p>
                <h2 className="display-type mt-3 text-4xl leading-none tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
                  Choose the next tiny problem.
                </h2>
              </div>
              <p className="text-sm leading-6 text-[var(--muted)] sm:text-right">
                A numbered shelf for five spare minutes, one friend who needs to
                see it, and a group chat that deserves better bait.
              </p>
            </div>

            <ol className="quiz-ledger" start={2}>
              {moreQuizzes.map((quiz, index) => (
                <li key={quiz.slug}>
                  <Link
                    to="/quiz/$quizSlug"
                    params={{
                      quizSlug: quiz.slug,
                    }}
                    className="quiz-ledger__item group no-underline"
                  >
                    <span className="quiz-ledger__number">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                    <div className="max-w-3xl">
                      <h3 className="display-type text-3xl leading-[1.02] tracking-[-0.035em] text-[var(--ink)] transition group-hover:opacity-75">
                        {quiz.title}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        {quiz.description}
                      </p>
                    </div>
                    <span className="quiz-ledger__action">
                      Open
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function buildHomePageFeed(
  quizzes: readonly PublishedQuizSummary[],
  featuredQuizSlug: string,
): HomePageFeed {
  if (quizzes.length === 0) {
    return {
      featuredQuiz: null,
      moreQuizzes: [],
      quizCount: 0,
    }
  }

  const featuredQuiz =
    quizzes.find((quiz) => quiz.slug === featuredQuizSlug) ?? quizzes[0]

  return {
    featuredQuiz,
    moreQuizzes: quizzes.filter((quiz) => quiz.slug !== featuredQuiz.slug),
    quizCount: quizzes.length,
  }
}
