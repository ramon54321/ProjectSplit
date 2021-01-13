export function ensure<T>(obj: T | undefined): T {
  if (obj === undefined) {
    throw new Error('Cannot Ensure Object')
  }
  return obj
}