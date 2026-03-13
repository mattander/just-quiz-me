import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { getRuntimeConfig } from '../lib/runtime-config'

import {
  foundationEmailSchema,
  foundationInterestSchema,
  foundationNameSchema,
  foundationSnapshot,
  foundationTrackSchema,
  loadFoundationSnapshot,
  type FoundationInterestInput,
} from '../lib/foundation'

export const Route = createFileRoute('/')({
  loader: () => getRuntimeConfig(),
  component: HomePage,
})

function getFirstErrorMessage(errors: readonly unknown[]): string | null {
  for (const error of errors) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message
    }
  }

  return null
}

function HomePage() {
  const runtimeConfig = Route.useLoaderData()
  const phaseLabel =
    runtimeConfig.appEnv === 'production'
      ? 'Phase 1 app shell'
      : `Phase 1 app shell · ${runtimeConfig.appEnv}`
  const { data } = useQuery({
    queryKey: ['foundation-snapshot'],
    queryFn: loadFoundationSnapshot,
    initialData: foundationSnapshot,
  })
  const [submittedInterest, setSubmittedInterest] =
    useState<FoundationInterestInput | null>(null)
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      track: '',
    } satisfies FoundationInterestInput,
    validators: {
      onSubmit: foundationInterestSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmittedInterest(value)
    },
  })

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(235,112,66,0.3),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-12 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(29,138,126,0.26),transparent_72%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(223,180,81,0.18),transparent_70%)]" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-center">
          <div>
            <p className="eyebrow mb-4">{phaseLabel}</p>
            <div className="mb-5 flex flex-wrap gap-2">
              {data.badges.map((badge) => (
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
              {data.notes.map((note) => (
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

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.cards.map((card) => (
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
        </div>

        <section className="glass-panel-soft rounded-[1.5rem] px-5 py-5 sm:px-6">
          <p className="eyebrow mb-2">Foundation wiring</p>
          <h2 className="text-2xl font-semibold text-[var(--ink)]">
            Query, Form, and Valibot are live in the shell.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            This small form keeps the Phase 1 foundation honest: React Query
            provides the shell snapshot, TanStack Form manages state, and
            Valibot validates the typed input boundary before submission.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void form.handleSubmit()
            }}
          >
            <form.Field
              name="name"
              validators={{
                onBlur: foundationNameSchema,
                onChange: foundationNameSchema,
              }}
            >
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                )

                return (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--ink)]">
                      Name
                    </span>
                    <input
                      className="w-full rounded-2xl border border-[var(--panel-border)] bg-[rgba(255,255,255,0.76)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[rgba(29,138,126,0.42)] focus:ring-2 focus:ring-[rgba(29,138,126,0.18)]"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="Matt Anderson"
                    />
                    {errorMessage ? (
                      <span className="mt-2 block text-sm text-[var(--accent-coral)]">
                        {errorMessage}
                      </span>
                    ) : null}
                  </label>
                )
              }}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onBlur: foundationEmailSchema,
                onChange: foundationEmailSchema,
              }}
            >
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                )

                return (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--ink)]">
                      Email
                    </span>
                    <input
                      className="w-full rounded-2xl border border-[var(--panel-border)] bg-[rgba(255,255,255,0.76)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[rgba(29,138,126,0.42)] focus:ring-2 focus:ring-[rgba(29,138,126,0.18)]"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="matt@example.com"
                    />
                    {errorMessage ? (
                      <span className="mt-2 block text-sm text-[var(--accent-coral)]">
                        {errorMessage}
                      </span>
                    ) : null}
                  </label>
                )
              }}
            </form.Field>

            <form.Field
              name="track"
              validators={{
                onBlur: foundationTrackSchema,
                onChange: foundationTrackSchema,
              }}
            >
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                )

                return (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--ink)]">
                      First Phase 1 focus
                    </span>
                    <select
                      className="w-full rounded-2xl border border-[var(--panel-border)] bg-[rgba(255,255,255,0.76)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[rgba(29,138,126,0.42)] focus:ring-2 focus:ring-[rgba(29,138,126,0.18)]"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    >
                      <option value="">Choose a track</option>
                      {data.trackOptions.map((track) => (
                        <option key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                    {errorMessage ? (
                      <span className="mt-2 block text-sm text-[var(--accent-coral)]">
                        {errorMessage}
                      </span>
                    ) : null}
                  </label>
                )
              }}
            </form.Field>

            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full border border-[rgba(29,36,49,0.14)] bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--ink)_88%,black)] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? 'Saving focus...' : 'Save Phase 1 focus'}
                </button>
              )}
            </form.Subscribe>
          </form>

          {submittedInterest ? (
            <div className="mt-4 rounded-[1.25rem] border border-[rgba(29,138,126,0.2)] bg-[rgba(29,138,126,0.1)] px-4 py-4 text-sm leading-6 text-[var(--ink)]">
              <strong className="font-semibold">Recorded locally.</strong>{' '}
              {submittedInterest.name} is interested in{' '}
              {submittedInterest.track.toLowerCase()} updates at{' '}
              {submittedInterest.email}.
            </div>
          ) : null}
        </section>
      </section>
    </main>
  )
}
