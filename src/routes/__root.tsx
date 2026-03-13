import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'

import '../tailwind.css'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Just Quiz Me',
      },
      {
        name: 'description',
        content:
          'Play weirdly polished personality quizzes and get immediate results.',
      },
      {
        property: 'og:site_name',
        content: 'Just Quiz Me',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'theme-color',
        content: '#f6ecdc',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-16 text-center sm:px-6">
      <div className="glass-panel-soft rounded-[1.5rem] px-6 py-8">
        <p className="eyebrow mb-3">Not found</p>
        <h1 className="display-type text-3xl text-[var(--ink)] sm:text-4xl">
          This route has not been built yet.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          The Phase 1 shell is live, but this path is still waiting for its
          quiz-shaped future.
        </p>
      </div>
    </main>
  )
}
