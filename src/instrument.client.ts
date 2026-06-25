import * as Sentry from '@sentry/tanstackstart-react'
import {
  developmentTracesSampleRate,
  productionTracesSampleRate,
  sentryDsn,
} from './sentry-config.ts'

Sentry.init({
  dsn: sentryDsn,
  environment: import.meta.env.MODE,
  sendDefaultPii: false,
  tracesSampleRate: import.meta.env.DEV
    ? developmentTracesSampleRate
    : productionTracesSampleRate,
  enableLogs: true,
})

