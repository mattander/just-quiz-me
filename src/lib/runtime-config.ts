import type {} from './server-context'
import { createServerFn } from '@tanstack/react-start'
import {
  object,
  picklist,
  pipe,
  safeParse,
  string,
  summarize,
  url,
} from 'valibot'
import type { InferOutput } from 'valibot'

const runtimeConfigSchema = object({
  APP_ENV: picklist(['development', 'preview', 'production']),
  PUBLIC_SITE_URL: pipe(string(), url()),
})

type RuntimeBindings = InferOutput<typeof runtimeConfigSchema>

export type RuntimeConfigInput = {
  APP_ENV: string | undefined
  PUBLIC_SITE_URL: string | undefined
}

export type RuntimeConfig = {
  appEnv: RuntimeBindings['APP_ENV']
  publicSiteUrl: RuntimeBindings['PUBLIC_SITE_URL']
}

function parseRuntimeConfig(input: RuntimeConfigInput): RuntimeConfig {
  const result = safeParse(runtimeConfigSchema, input)

  if (!result.success) {
    throw new Error(
      `Invalid runtime configuration.\n${summarize(result.issues)}`,
    )
  }

  return {
    appEnv: result.output.APP_ENV,
    publicSiteUrl: result.output.PUBLIC_SITE_URL,
  }
}

export const getRuntimeConfig = createServerFn({ method: 'GET' }).handler(
  ({ context }) => {
    return parseRuntimeConfig(context.cloudflare.runtime)
  },
)
