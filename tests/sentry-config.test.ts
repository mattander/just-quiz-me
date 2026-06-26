import assert from 'node:assert/strict'
import test from 'node:test'
import {
  developmentTracesSampleRate,
  getHostedSentryDsn,
  getSentryTracesSampleRate,
  productionTracesSampleRate,
  sentryDsn,
} from '../src/sentry-config.ts'

test('hosted Sentry is disabled for local development', () => {
  assert.equal(getHostedSentryDsn('development'), undefined)
  assert.equal(getSentryTracesSampleRate('development'), developmentTracesSampleRate)
})

test('hosted Sentry remains enabled for deployed environments', () => {
  assert.equal(getHostedSentryDsn('production'), sentryDsn)
  assert.equal(getSentryTracesSampleRate('production'), productionTracesSampleRate)
  assert.equal(getHostedSentryDsn('preview'), sentryDsn)
  assert.equal(getSentryTracesSampleRate('preview'), productionTracesSampleRate)
})
