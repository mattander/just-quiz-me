import { getPlatformProxy } from 'wrangler'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'

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
    plugins: [tanstackStart(), viteReact()],
  }
})
