import { getPlatformProxy } from 'wrangler'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'

const sentryOrg = process.env.SENTRY_ORG || 'mattdev-z3'
const sentryProject = process.env.SENTRY_PROJECT || 'javascript-tanstackstart-react'
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN
const sentryPlugins = sentryAuthToken
  ? sentryTanstackStart({
      org: sentryOrg,
      project: sentryProject,
      authToken: sentryAuthToken,
      telemetry: false,
      sourcemaps: {
        filesToDeleteAfterUpload: ['dist/**/*.map'],
      },
    })
  : []

async function syncLocalRuntimeBindings() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { env } = await getPlatformProxy<
    Pick<
      CloudflareEnv,
      'APP_ENV' | 'PUBLIC_SITE_URL' | 'PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN'
    >
  >({
    environment: 'local',
  })

  if (env.APP_ENV !== undefined) {
    process.env.APP_ENV = env.APP_ENV
  }

  if (env.PUBLIC_SITE_URL !== undefined) {
    process.env.PUBLIC_SITE_URL = env.PUBLIC_SITE_URL
  }

  if (env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN !== undefined) {
    process.env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN =
      env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN
  }
}

export default defineConfig(async () => {
  await syncLocalRuntimeBindings()

  return {
    plugins: [
      tanstackStart(),
      viteReact(),
      ...sentryPlugins,
    ],
  }
})
