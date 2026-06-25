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
          'Play quick absurd quizzes, get an immediate result, and send it to someone you trust far too much.',
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
        content: '#f4efe7',
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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-16 sm:px-8">
      <div className="w-full border-t border-[color:var(--rule)] pt-8 text-center">
        <p className="eyebrow mb-3">Not found</p>
        <h1 className="display-type text-3xl text-[var(--ink)] sm:text-4xl">
          That quiz wandered off.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          The page you wanted is missing, unpublished, or was never real in the
          first place.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-[color:var(--rule-strong)] px-5 py-2.5 text-sm font-medium no-underline transition hover:bg-[color:var(--surface)]"
        >
          Back to the quiz pile
        </a>
      </div>
    </main>
  )
}
