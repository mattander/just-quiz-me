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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="w-full">
        <section className="max-w-3xl">
          <p className="eyebrow">Just Quiz Me</p>
          <h1 className="display-type mt-4 text-5xl leading-[0.94] tracking-[-0.04em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
            Strange little quizzes with immediate consequences.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Pick a quiz, answer a handful of multiple-choice questions, and get
            a ridiculous result you will immediately want to send to a friend.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Find out which Greek god would block you on Slack, which kitchen
            appliance would betray you in the Civil War, or what kind of town
            legend you would become by accident.
          </p>
        </section>

        {featuredQuiz ? (
          <section className="mt-14 border-t border-[color:var(--rule)] pt-8 sm:pt-10">
            <p className="eyebrow">Start here</p>
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
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
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-[var(--page)] no-underline transition hover:opacity-88"
              >
                Play the featured quiz
              </Link>
            </div>
          </section>
        ) : null}

        {moreQuizzes.length > 0 ? (
          <section className="mt-14 border-t border-[color:var(--rule)] pt-8 sm:pt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Also live</p>
                <h2 className="display-type mt-3 text-3xl text-[var(--ink)] sm:text-4xl">
                  More quizzes for the group chat.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-right">
                Lightweight, fast, and weird on purpose.
              </p>
            </div>

            <ul className="mt-8 space-y-6">
              {moreQuizzes.map((quiz) => (
                <li key={quiz.slug} className="border-b border-[color:var(--rule)] pb-6">
                  <Link
                    to="/quiz/$quizSlug"
                    params={{
                      quizSlug: quiz.slug,
                    }}
                    className="group block no-underline"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
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
    }
  }

  const featuredQuiz =
    quizzes.find((quiz) => quiz.slug === featuredQuizSlug) ?? quizzes[0]

  return {
    featuredQuiz,
    moreQuizzes: quizzes.filter((quiz) => quiz.slug !== featuredQuiz.slug),
  }
}
