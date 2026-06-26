import * as Sentry from '@sentry/tanstackstart-react'
import {
  getHostedSentryDsn,
  getSentryTracesSampleRate,
} from './sentry-config.ts'

const sentryEnvironment = import.meta.env.MODE
const hostedSentryDsn = getHostedSentryDsn(sentryEnvironment)

if (hostedSentryDsn) {
  Sentry.init({
    dsn: hostedSentryDsn,
    environment: sentryEnvironment,
    sendDefaultPii: false,
    tracesSampleRate: getSentryTracesSampleRate(sentryEnvironment),
    enableLogs: true,
  })
}
