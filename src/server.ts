import type {} from './lib/server-context'
import * as Sentry from '@sentry/cloudflare'
import type { Register } from '@tanstack/react-router'
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { createQuizRepository } from './lib/quiz-repository.ts'
import { getAppRequestContext, type AppRequestContext } from './lib/server-context.ts'
import { buildAbsoluteUrl, buildRobotsTxt, buildSitemapXml } from './lib/seo.ts'
import {
  parseRuntimeConfig,
  type RuntimeConfigInput,
} from './lib/runtime-config'
import {
  getHostedSentryDsn,
  getSentryTracesSampleRate,
} from './sentry-config.ts'

const handleRequest = createStartHandler<Register>(defaultStreamHandler)

function getTanStackSentrySpanDetails(request: Request) {
  const requestUrl = new URL(request.url)
  const method = request.method || 'GET'
  const isServerFunctionRequest =
    requestUrl.pathname.includes('_serverFn') ||
    requestUrl.pathname.includes('createServerFn')
  const op = isServerFunctionRequest
    ? 'function.tanstackstart'
    : 'http.server'
  const origin = isServerFunctionRequest
    ? 'manual.function.tanstackstart.server.cloudflare'
    : 'manual.http.tanstackstart.server.cloudflare'

  return {
    name: `${method} ${requestUrl.pathname}`,
    op,
    origin,
  }
}

async function injectSentryTraceMetaTags(
  response: Response,
  hostedSentryEnabled: boolean,
): Promise<Response> {
  if (!hostedSentryEnabled) {
    return response
  }

  const contentType = response.headers.get('content-type')

  if (!contentType?.startsWith('text/html') || !response.body) {
    return response
  }

  const metaTags = Sentry.getTraceMetaTags()

  if (!metaTags) {
    return response
  }

  const html = await response.text()

  if (html.includes('"sentry-trace"') || html.includes("'sentry-trace'")) {
    return new Response(html, response)
  }

  const headers = new Headers(response.headers)
  headers.delete('content-length')

  return new Response(html.replace(/<head>/i, `<head>${metaTags}`), {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function handleSentryStartRequest(
  request: Request,
  requestContext: AppRequestContext,
  appEnv: string,
) {
  const spanDetails = getTanStackSentrySpanDetails(request)
  const hostedSentryEnabled = Boolean(getHostedSentryDsn(appEnv))

  return Sentry.startSpan(
    {
      name: spanDetails.name,
      op: spanDetails.op,
      attributes: {
        [Sentry.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanDetails.origin,
        [Sentry.SEMANTIC_ATTRIBUTE_SENTRY_OP]: spanDetails.op,
      },
    },
    async () => {
      const response = await handleRequest(request, {
        context: requestContext,
      })

      return injectSentryTraceMetaTags(response, hostedSentryEnabled)
    },
  )
}

function getRuntimeBindings(workerEnv?: CloudflareEnv): RuntimeConfigInput {
  return {
    APP_ENV: workerEnv?.APP_ENV ?? process.env.APP_ENV,
    PUBLIC_SITE_URL: workerEnv?.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL,
    PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN:
      workerEnv?.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN ??
      process.env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN,
  }
}

async function handleMetadataRequest(
  request: Request,
  workerEnv?: CloudflareEnv,
): Promise<Response | null> {
  const requestUrl = new URL(request.url)
  const runtimeConfig = parseRuntimeConfig(getRuntimeBindings(workerEnv))

  if (requestUrl.pathname === '/robots.txt') {
    return new Response(buildRobotsTxt(runtimeConfig.publicSiteUrl), {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    })
  }

  if (requestUrl.pathname === '/sitemap.xml') {
    const repository = createQuizRepository(workerEnv?.QUIZ_DB)
    const quizzes = await repository.listPublished()
    const sitemapXml = buildSitemapXml([
      {
        url: buildAbsoluteUrl(runtimeConfig.publicSiteUrl, '/'),
      },
      ...quizzes.map((quiz) => ({
        url: buildAbsoluteUrl(runtimeConfig.publicSiteUrl, `/quiz/${quiz.slug}`),
      })),
    ])

    return new Response(sitemapXml, {
      headers: {
        'content-type': 'application/xml; charset=utf-8',
      },
    })
  }

  return null
}

const server = {
  async fetch(
    request: Request,
    workerEnv?: CloudflareEnv,
    executionContext?: ExecutionContext,
  ) {
    const metadataResponse = await handleMetadataRequest(request, workerEnv)

    if (metadataResponse) {
      return metadataResponse
    }

    const runtimeBindings = getRuntimeBindings(workerEnv)
    const appEnv = runtimeBindings.APP_ENV ?? 'production'

    const requestContext: AppRequestContext = getAppRequestContext({
      cloudflare: {
        bindings: {
          QUIZ_DB: workerEnv?.QUIZ_DB,
        },
        runtime: runtimeBindings,
        executionContext,
      },
    })

    return handleSentryStartRequest(request, requestContext, appEnv)
  },
} satisfies ExportedHandler<CloudflareEnv>

export default Sentry.withSentry<CloudflareEnv>(
  (workerEnv) => {
    const appEnv = workerEnv?.APP_ENV ?? process.env.APP_ENV ?? 'production'
    const hostedSentryDsn = getHostedSentryDsn(appEnv)

    return {
      dsn: hostedSentryDsn,
      environment: appEnv,
      sendDefaultPii: false,
      tracesSampleRate: getSentryTracesSampleRate(appEnv),
      enableLogs: true,
    }
  },
  server,
)
