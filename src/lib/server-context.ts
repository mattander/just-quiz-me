import type { RuntimeConfigInput } from './runtime-config'

export type AppRequestContext = {
  cloudflare: {
    runtime: RuntimeConfigInput
    executionContext: ExecutionContext | undefined
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
