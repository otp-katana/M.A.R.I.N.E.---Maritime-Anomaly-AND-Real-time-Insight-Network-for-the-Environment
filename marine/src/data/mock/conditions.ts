import type { ConditionSeries, ConditionVariable, SeriesPoint } from '@/data/types'

const DAY = 86_400_000
const START = Date.UTC(2026, 5, 1) // 1 Haziran 2026
const DAYS = 148 // 26 Ekim 2026'ya kadar

/** Tohumlu sözde-rastgele sayı üretici */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

type Shape = {
  seed: number
  base: number
  amp: number
  phase: number
  noise: number
  /** Serinin son değeri (diğer kartlarla tutarlı olsun diye sabitlenir) */
  last: number
}

function makeSeries({ seed, base, amp, phase, noise, last }: Shape): SeriesPoint[] {
  const rand = rng(seed)
  const raw = Array.from({ length: DAYS }, (_, i) => {
    const season = Math.sin((i / DAYS) * Math.PI * 1.6 + phase)
    return base + amp * season + (rand() - 0.5) * 2 * noise
  })
  const offset = last - raw[raw.length - 1]
  return raw.map((v, i) => ({ t: START + i * DAY, v: v + offset }))
}

export const mockConditions: Record<ConditionVariable, ConditionSeries> = {
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    unit: '°C',
    decimals: 1,
    tickSuffix: '°C',
    points: makeSeries({ seed: 11, base: 22.6, amp: 1.2, phase: 0.3, noise: 0.08, last: 21.4 }),
  },
  salinity: {
    id: 'salinity',
    label: 'Salinity',
    unit: 'PSU',
    decimals: 2,
    tickSuffix: '',
    points: makeSeries({ seed: 23, base: 34.75, amp: 0.12, phase: 1.0, noise: 0.02, last: 34.72 }),
  },
  chlorophyll: {
    id: 'chlorophyll',
    label: 'Chlorophyll',
    unit: 'mg/m³',
    decimals: 2,
    tickSuffix: '',
    points: makeSeries({ seed: 37, base: 0.33, amp: 0.05, phase: 2.0, noise: 0.012, last: 0.35 }),
  },
}