import type {} from './lib/server-context'
import type { Register } from '@tanstack/react-router'
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { createQuizRepository } from './lib/quiz-repository.ts'
import { getAppRequestContext, type AppRequestContext } from './lib/server-context.ts'
import { buildAbsoluteUrl, buildRobotsTxt, buildSitemapXml } from './lib/seo.ts'
import {
  parseRuntimeConfig,
  type RuntimeConfigInput,
} from './lib/runtime-config'

const handleRequest = createStartHandler<Register>(defaultStreamHandler)

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

    const requestContext: AppRequestContext = getAppRequestContext({
      cloudflare: {
        bindings: {
          QUIZ_DB: workerEnv?.QUIZ_DB,
        },
        runtime: getRuntimeBindings(workerEnv),
        executionContext,
      },
    })

    return handleRequest(request, {
      context: requestContext,
    })
  },
} satisfies ExportedHandler<CloudflareEnv>

export default server
