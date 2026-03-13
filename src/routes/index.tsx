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
      className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8"
      data-ads-enabled={settings.adsEnabled ? 'true' : 'false'}
      data-featured-quiz-slug={settings.featuredQuizSlug}
    >
      <section className="glass-panel w-full overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.95fr)] lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow">Phase 1 preview</p>
            <h1 className="display-type text-4xl leading-[0.96] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl lg:text-7xl">
              Just Quiz Me has its first playable quiz
            </h1>

            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              The landing shell is still warming up, but the core quiz loop is
              live: answer a full set of questions, submit once, and get an
              immediate result without saving an attempt anywhere.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/quiz/$quizSlug"
                params={{
                  quizSlug: settings.featuredQuizSlug,
                }}
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-white no-underline transition hover:opacity-90"
              >
                Play the featured quiz
              </Link>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Featured quiz slug: {settings.featuredQuizSlug}
              </p>
            </div>
          </div>

          <figure className="glass-panel-soft rounded-[1.5rem] p-4 sm:p-6">
            <svg
              className="h-auto w-full"
              viewBox="0 0 720 640"
              role="img"
              aria-labelledby="hero-art-title hero-art-desc"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title id="hero-art-title">
                Surreal still life hinting at absurd personality quizzes
              </title>
              <desc id="hero-art-desc">
                A marble bust sits in the center of a warm collage surrounded by
                a toaster, a stand mixer, laurel leaves, a message bubble, and
                a small lightning bolt.
              </desc>
              <defs>
                <linearGradient id="art-sky" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbf4e8" />
                  <stop offset="100%" stopColor="#ecd8bb" />
                </linearGradient>
                <radialGradient id="art-halo" cx="50%" cy="34%" r="46%">
                  <stop offset="0%" stopColor="#fff8ef" />
                  <stop offset="100%" stopColor="#fff8ef" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="720" height="640" rx="36" fill="url(#art-sky)" />
              <circle cx="360" cy="224" r="182" fill="url(#art-halo)" />
              <circle cx="136" cy="140" r="56" fill="#eb7042" fillOpacity="0.15" />
              <circle cx="594" cy="132" r="66" fill="#1d8a7e" fillOpacity="0.14" />
              <circle cx="594" cy="486" r="78" fill="#dfb451" fillOpacity="0.16" />

              <g fill="#1d2431" fillOpacity="0.1">
                <ellipse cx="360" cy="584" rx="188" ry="22" />
                <ellipse cx="128" cy="534" rx="96" ry="16" />
                <ellipse cx="590" cy="532" rx="92" ry="18" />
              </g>

              <g transform="translate(78 302)">
                <rect x="0" y="28" width="164" height="128" rx="30" fill="#eb7042" />
                <rect x="18" y="52" width="128" height="82" rx="18" fill="#fff8ef" />
                <rect x="42" y="16" width="22" height="36" rx="11" fill="#fff8ef" />
                <rect x="100" y="16" width="22" height="36" rx="11" fill="#fff8ef" />
                <rect x="48" y="74" width="30" height="8" rx="4" fill="#eb7042" />
                <rect x="88" y="74" width="30" height="8" rx="4" fill="#eb7042" />
                <circle cx="44" cy="118" r="8" fill="#1d2431" fillOpacity="0.2" />
              </g>

              <g transform="translate(494 284)">
                <rect x="32" y="38" width="128" height="92" rx="28" fill="#1d8a7e" />
                <rect x="18" y="16" width="68" height="34" rx="17" fill="#1d2431" fillOpacity="0.08" />
                <rect x="58" y="0" width="74" height="34" rx="17" fill="#fff8ef" />
                <rect x="54" y="70" width="84" height="14" rx="7" fill="#fff8ef" fillOpacity="0.9" />
                <rect x="54" y="94" width="58" height="12" rx="6" fill="#fff8ef" fillOpacity="0.72" />
                <circle cx="176" cy="118" r="11" fill="#dfb451" />
              </g>

              <g transform="translate(286 118)">
                <path
                  d="M78 48c0-28 22-50 50-50s50 22 50 50v28c0 18-8 36-22 48l-8 7v36h38c24 0 44 20 44 44v82H26v-82c0-24 20-44 44-44h38v-36l-8-7C86 112 78 94 78 76V48Z"
                  fill="#f7f1e8"
                />
                <path
                  d="M122 36c-18 0-32 14-32 32v26c0 27 23 50 50 50 26 0 48-23 48-50V68c0-18-14-32-32-32h-34Z"
                  fill="#fffaf2"
                />
                <path
                  d="M92 74c12-20 34-32 60-32 14 0 28 4 38 10-8-18-26-30-48-30h-30c-22 0-40 18-40 40v18c0 11 3 22 8 31 1-14 5-27 12-37Z"
                  fill="#d8d1c7"
                />
                <path
                  d="M102 214h76"
                  stroke="#d4cabc"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M84 274h112"
                  stroke="#e6ddcf"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
              </g>

              <g fill="none" stroke="#1d8a7e" strokeLinecap="round" strokeWidth="14">
                <path d="M210 160c24 10 42 28 52 52" />
                <path d="M510 168c-18 8-34 22-46 42" />
              </g>

              <g fill="#dfb451">
                <path d="M568 200l18 32 34 8-24 22 4 34-32-18-30 18 6-34-24-22 34-8 14-32Z" />
              </g>

              <g transform="translate(176 144)">
                <path
                  d="M22 0c20 32 22 64 6 96M54 8c16 28 18 56 4 86M84 18c14 24 15 48 4 74"
                  fill="none"
                  stroke="#1d8a7e"
                  strokeLinecap="round"
                  strokeWidth="10"
                />
              </g>

              <g transform="translate(528 176)" fill="#fff8ef" stroke="#1d2431" strokeOpacity="0.12">
                <path d="M0 28c0-15 12-28 28-28h88c15 0 28 13 28 28v46c0 15-13 28-28 28H62l-34 28 10-28H28C12 102 0 89 0 74V28Z" />
              </g>
            </svg>
          </figure>
        </div>
      </section>
    </main>
  )
}
