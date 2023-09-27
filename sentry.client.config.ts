import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: process.env.NODE_ENV === 'production' ? SENTRY_DSN : undefined,
  tracesSampleRate: 0.5,
  ignoreErrors: [
    /AboutError/,
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications.',
  ],
})
