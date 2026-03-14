import { Link, createFileRoute } from '@tanstack/react-router'
import { getAppSettings } from '../lib/app-settings-service.ts'
import { getRuntimeConfig } from '../lib/runtime-config.ts'
import {
  buildAbsoluteUrl,
  createCanonicalLinks,
  createPageMetadata,
} from '../lib/seo.ts'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [settings, runtimeConfig] = await Promise.all([
      getAppSettings(),
      getRuntimeConfig(),
    ])

    return {
      settings,
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
        title: 'Just Quiz Me | Play absurd personality quizzes',
        description:
          'Play weirdly polished personality quizzes, get an immediate result, and share the outcome without creating an account.',
        canonicalUrl,
      }),
      links: createCanonicalLinks(canonicalUrl),
    }
  },
  component: HomePage,
})

function HomePage() {
  const { settings } = Route.useLoaderData()

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-5 py-14 sm:px-8 sm:py-20 lg:px-10"
      data-ads-enabled={settings.adsEnabled ? 'true' : 'false'}
      data-featured-quiz-slug={settings.featuredQuizSlug}
    >
      <section className="w-full">
        <div className="max-w-3xl">
          <p className="eyebrow">Now playable</p>
          <h1 className="display-type mt-4 text-4xl leading-[0.98] tracking-[-0.045em] text-[var(--ink)] sm:text-5xl lg:text-7xl">
            One absurd quiz.
            <br />
            No signup. Immediate result.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Just Quiz Me is staying deliberately simple at the front door. Pick
            the featured quiz, answer the full set of questions, and get a
            result right away without creating an account or leaving behind a
            saved attempt.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/quiz/$quizSlug"
              params={{
                quizSlug: settings.featuredQuizSlug,
              }}
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-white no-underline transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
            >
              Play the featured quiz
            </Link>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Current featured quiz: {settings.featuredQuizSlug}
            </p>
          </div>

          <dl className="landing-meta mt-12 grid gap-6 text-sm leading-6 text-[var(--muted)] sm:grid-cols-2">
            <div>
              <dt className="landing-label">Preview state</dt>
              <dd className="mt-1 text-[var(--ink)]">
                Full question flow is live now.
              </dd>
            </div>
            <div>
              <dt className="landing-label">Interaction model</dt>
              <dd className="mt-1 text-[var(--ink)]">
                One submission, immediate result, no saved attempt.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}
