import type {} from './server-context'
import { createServerFn } from '@tanstack/react-start'
import { getAppRequestContext } from './server-context.ts'
import {
  literal,
  object,
  picklist,
  pipe,
  regex,
  safeParse,
  string,
  summarize,
  union,
  url,
} from 'valibot'
import type { InferOutput } from 'valibot'

const runtimeConfigSchema = object({
  APP_ENV: picklist(['development', 'preview', 'production']),
  PUBLIC_SITE_URL: pipe(string(), url()),
  PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN: union([
    literal(''),
    pipe(
      string(),
      regex(
        /^[a-z0-9]{32}$/i,
        'Cloudflare Web Analytics token must be 32 alphanumeric characters.',
      ),
    ),
  ]),
})

type RuntimeBindings = InferOutput<typeof runtimeConfigSchema>

export type RuntimeConfigInput = {
  APP_ENV?: string
  PUBLIC_SITE_URL?: string
  PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN?: string
}

export type RuntimeConfig = {
  appEnv: RuntimeBindings['APP_ENV']
  publicSiteUrl: RuntimeBindings['PUBLIC_SITE_URL']
  cloudflareWebAnalyticsToken:
    | RuntimeBindings['PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN']
    | null
}

export function parseRuntimeConfig(input: RuntimeConfigInput): RuntimeConfig {
  const result = safeParse(runtimeConfigSchema, {
    ...input,
    PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN:
      input.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN ?? '',
  })

  if (!result.success) {
    throw new Error(
      `Invalid runtime configuration.\n${summarize(result.issues)}`,
    )
  }

  return {
    appEnv: result.output.APP_ENV,
    publicSiteUrl: result.output.PUBLIC_SITE_URL,
    cloudflareWebAnalyticsToken:
      result.output.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN || null,
  }
}

export const getRuntimeConfig = createServerFn({ method: 'GET' }).handler(
  ({ context }) => {
    const requestContext = getAppRequestContext(context)

    return parseRuntimeConfig(requestContext.cloudflare.runtime)
  },
)
