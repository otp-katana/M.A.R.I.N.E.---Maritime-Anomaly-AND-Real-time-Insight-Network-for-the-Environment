const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'UTC',
})

/** "2026-10-26T14:37:00Z" -> "Oct 26, 2026 · 14:37 UTC" */
export function formatUtcStamp(iso: string): string {
  const d = new Date(iso)
  return `${dateFmt.format(d)} · ${timeFmt.format(d)} UTC`
}