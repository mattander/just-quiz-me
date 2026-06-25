import assert from 'node:assert/strict'
import test from 'node:test'
import {
  parseRuntimeConfig,
  type RuntimeConfigInput,
} from '../src/lib/runtime-config.ts'

const baseRuntimeConfig: RuntimeConfigInput = {
  APP_ENV: 'production',
  PUBLIC_SITE_URL: 'https://justquiz.me',
  PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN: '',
}

test('runtime config treats a blank Cloudflare Web Analytics token as disabled', () => {
  assert.equal(
    parseRuntimeConfig(baseRuntimeConfig).cloudflareWebAnalyticsToken,
    null,
  )
})

test('runtime config treats a missing Cloudflare Web Analytics token as disabled', () => {
  assert.equal(
    parseRuntimeConfig({
      APP_ENV: 'production',
      PUBLIC_SITE_URL: 'https://justquiz.me',
    }).cloudflareWebAnalyticsToken,
    null,
  )
})

test('runtime config accepts a Cloudflare Web Analytics token', () => {
  const runtimeConfig = parseRuntimeConfig({
    ...baseRuntimeConfig,
    PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN:
      '0123456789abcdef0123456789uvwxyz',
  })

  assert.equal(
    runtimeConfig.cloudflareWebAnalyticsToken,
    '0123456789abcdef0123456789uvwxyz',
  )
})

test('runtime config rejects malformed Cloudflare Web Analytics tokens', () => {
  assert.throws(() =>
    parseRuntimeConfig({
      ...baseRuntimeConfig,
      PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN: 'not-a-cloudflare-token',
    }),
  )
})
