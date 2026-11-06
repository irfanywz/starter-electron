export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  // Error dari react-router (mis. 404) bentuknya { status, statusText }
  if (error && typeof error === 'object' && 'statusText' in error) return String(error.statusText)
  return 'Unknown error'
}

export function errorStack(error: unknown): string {
  if (error instanceof Error) return error.stack ?? error.message
  try {
    return JSON.stringify(error, null, 2) ?? String(error)
  } catch {
    return String(error)
  }
}
