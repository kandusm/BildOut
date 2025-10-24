import { Logtail } from '@logtail/next'

// Initialize Logtail only if token is available
const logtail = process.env.LOGTAIL_SOURCE_TOKEN
  ? new Logtail(process.env.LOGTAIL_SOURCE_TOKEN)
  : null

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

  // Send to BetterStack in production
  if (logtail) {
    try {
      await logtail.error(errorMessage, {
        error: {
          message: errorMessage,
          stack: errorStack,
        },
        ...context,
      })
      await logtail.flush()
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

  if (logtail) {
    try {
      await logtail.info(message, context)
      await logtail.flush()
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

  if (logtail) {
    try {
      await logtail.warn(message, context)
      await logtail.flush()
    } catch (error) {
      console.error('Failed to log to BetterStack:', error)
    }
  }
}
