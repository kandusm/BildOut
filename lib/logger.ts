import { log } from '@logtail/next'

// Use the log function from @logtail/next
// It automatically uses LOGTAIL_SOURCE_TOKEN from env

/**
 * Log an error to BetterStack
 */
export async function logError(
  error: Error | unknown,
  context?: {
    userId?: string
    orgId?: string
    path?: string
    [key: string]: any
  }
) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  // Always log to console for development
  console.error('Error:', errorMessage, context)

  // Send to BetterStack in production (only if token is configured)
  if (process.env.LOGTAIL_SOURCE_TOKEN) {
    try {
      await log.error(errorMessage, {
        error: {
          message: errorMessage,
          stack: errorStack,
        },
        ...context,
      })
    } catch (logtailError) {
      // Don't let logging errors crash the app
      console.error('Failed to log to BetterStack:', logtailError)
    }
  }
}

/**
 * Log general info to BetterStack
 */
export async function logInfo(
  message: string,
  context?: {
    userId?: string
    orgId?: string
    [key: string]: any
  }
) {
  console.log('Info:', message, context)

  if (process.env.LOGTAIL_SOURCE_TOKEN) {
    try {
      await log.info(message, context)
    } catch (error) {
      console.error('Failed to log to BetterStack:', error)
    }
  }
}

/**
 * Log warnings to BetterStack
 */
export async function logWarning(
  message: string,
  context?: {
    userId?: string
    orgId?: string
    [key: string]: any
  }
) {
  console.warn('Warning:', message, context)

  if (process.env.LOGTAIL_SOURCE_TOKEN) {
    try {
      await log.warn(message, context)
    } catch (error) {
      console.error('Failed to log to BetterStack:', error)
    }
  }
}
