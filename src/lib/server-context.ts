import type { RuntimeConfigInput } from './runtime-config'

export type AppRequestContext = {
  cloudflare: {
    bindings: {
      QUIZ_DB: D1Database | undefined
    }
    runtime: RuntimeConfigInput
    executionContext: ExecutionContext | undefined
  }
}

export function getAppRequestContext(
  context?: AppRequestContext,
): AppRequestContext {
  if (context) {
    return context
  }

  return {
    cloudflare: {
      bindings: {
        QUIZ_DB: undefined,
      },
      runtime: {
        APP_ENV: process.env.APP_ENV,
        PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
      },
      executionContext: undefined,
    },
  }
}

declare module '@tanstack/router-core' {
  interface Register {
    server: {
      requestContext: AppRequestContext
    }
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    server: {
      requestContext: AppRequestContext
    }
  }
}
