type ClassValue = string | false | null | undefined

/** Koşullu sınıf adlarını birleştirir. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}