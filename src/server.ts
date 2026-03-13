import type {} from './lib/server-context'
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import type { RuntimeConfigInput } from './lib/runtime-config'

const handleRequest = createStartHandler(defaultStreamHandler)

function getRuntimeBindings(workerEnv?: CloudflareEnv): RuntimeConfigInput {
  return {
    APP_ENV: workerEnv?.APP_ENV ?? process.env.APP_ENV,
    PUBLIC_SITE_URL: workerEnv?.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL,
  }
}

const server = {
  async fetch(
    request: Request,
    workerEnv?: CloudflareEnv,
    executionContext?: ExecutionContext,
  ) {
    return handleRequest(request, {
      context: {
        cloudflare: {
          runtime: getRuntimeBindings(workerEnv),
          executionContext,
        },
      },
    })
  },
} satisfies ExportedHandler<CloudflareEnv>

export default server
