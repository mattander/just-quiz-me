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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="w-full">
        <section className="max-w-3xl">
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
          <h1 className="display-type mt-4 text-5xl leading-[0.94] tracking-[-0.04em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
            Quick little quizzes for unserious people with excellent taste.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Pick a short quiz, answer a handful of questions, and get a result
            specific enough to feel rude but harmless enough to send immediately.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            {feed.quizCount} quizzes are live right now. No accounts, no saved
            attempts, no suspiciously long onboarding flow.
          </p>
        </section>

        {featuredQuiz ? (
          <section className="mt-12 border-t border-[color:var(--rule)] pt-8 sm:mt-14 sm:pt-10">
            <p className="eyebrow">Start here</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="max-w-2xl">
                <h2 className="display-type text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
                  {featuredQuiz.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-[var(--muted)]">
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
                Play the featured quiz
              </Link>
            </div>
          </section>
        ) : null}

        {moreQuizzes.length > 0 ? (
          <section className="mt-12 border-t border-[color:var(--rule)] pt-8 sm:mt-14 sm:pt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Quiz shelf</p>
                <h2 className="display-type mt-3 text-3xl text-[var(--ink)] sm:text-4xl">
                  Choose your next small crisis.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-right">
                Built for five spare minutes, one friend who needs to see it,
                and a group chat that deserves better bait.
              </p>
            </div>

            <ol className="mt-8 divide-y divide-[color:var(--rule)] border-y border-[color:var(--rule)]">
              {moreQuizzes.map((quiz, index) => (
                <li key={quiz.slug}>
                  <Link
                    to="/quiz/$quizSlug"
                    params={{
                      quizSlug: quiz.slug,
                    }}
                    className="group grid gap-4 py-5 no-underline sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-start sm:py-6"
                  >
                    <span className="eyebrow text-[0.68rem]">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                    <div className="max-w-2xl">
                      <h3 className="text-2xl font-semibold leading-tight text-[var(--ink)] transition group-hover:opacity-75">
                        {quiz.title}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        {quiz.description}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-[var(--ink)] transition group-hover:translate-x-0.5">
                      Play quiz →
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
