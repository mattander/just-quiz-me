import * as Sentry from '@sentry/tanstackstart-react'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { getHostedSentryDsn } from './sentry-config.ts'

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
  })

  if (!router.isServer && getHostedSentryDsn(import.meta.env.MODE)) {
    Sentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router))
  }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
