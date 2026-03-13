import { createFileRoute } from '@tanstack/react-router'

type StackCard = {
  title: string
  description: string
}

const stackBadges = [
  'TanStack Start',
  'React 19',
  'TypeScript',
  'Vite 8',
  'Tailwind 4',
  'Cloudflare Workers',
]

const stackCards: StackCard[] = [
  {
    title: 'TanStack Start app shell',
    description:
      'A real Start router now owns the page shell instead of a static HTML document.',
  },
  {
    title: 'React + TypeScript',
    description:
      'The UI is rendered through React components with strict TypeScript compiler settings.',
  },
  {
    title: 'Vite 8 target',
    description:
      'The build and local dev workflow now runs through the Vite 8 toolchain.',
  },
  {
    title: 'Tailwind working',
    description:
      'Utility classes and Tailwind v4 styling power the new responsive shell.',
  },
  {
    title: 'Cloudflare-ready output',
    description:
      'Wrangler now deploys the built Start server bundle and static client assets.',
  },
]

const bootstrapNotes = [
  'Router shell and landing surface live in React components.',
  'Tailwind utilities style the new Phase 1 foundation without extra config churn.',
  'Cloudflare deploys are aligned to the built Start server output in dist/server.',
]

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(235,112,66,0.3),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-12 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(29,138,126,0.26),transparent_72%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(223,180,81,0.18),transparent_70%)]" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-center">
          <div>
            <p className="eyebrow mb-4">Phase 1 app shell</p>
            <div className="mb-5 flex flex-wrap gap-2">
              {stackBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--panel-border)] bg-[rgba(255,255,255,0.68)] px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[var(--ink)] uppercase"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="display-type max-w-3xl text-4xl leading-[0.96] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl lg:text-7xl">
              Just Quiz Me now has its TanStack Start foundation.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              This repo now boots through a React and TypeScript app shell,
              styled with Tailwind and prepared for Cloudflare-hosted Start
              output. It is a clean Phase 1 base we can keep layering quiz
              product work onto without dragging the old static-only structure
              forward.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://tanstack.com/start/latest/docs/framework/react/overview"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-[rgba(235,112,66,0.34)] bg-[rgba(235,112,66,0.14)] px-5 py-3 text-sm font-semibold text-[var(--ink)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(235,112,66,0.22)]"
              >
                TanStack Start docs
              </a>
              <a
                href="https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/tanstack-start/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-[rgba(29,36,49,0.14)] bg-[rgba(255,255,255,0.72)] px-5 py-3 text-sm font-semibold text-[var(--ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(29,36,49,0.24)] hover:bg-[rgba(255,255,255,0.86)]"
              >
                Cloudflare hosting guide
              </a>
            </div>
          </div>

          <aside className="glass-panel-soft rounded-[1.5rem] px-5 py-5 sm:px-6">
            <p className="eyebrow mb-3">Bootstrapped here</p>
            <ul className="m-0 space-y-4 p-0">
              {bootstrapNotes.map((note) => (
                <li key={note} className="flex list-none gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-[var(--accent-teal)]" />
                  <span className="text-sm leading-6 text-[var(--muted)]">
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stackCards.map((card) => (
          <article
            key={card.title}
            className="glass-panel-soft rounded-[1.5rem] px-5 py-5"
          >
            <p className="eyebrow mb-2">Ready</p>
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              {card.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {card.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
