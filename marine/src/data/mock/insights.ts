import type { Insight } from '@/data/types'

export const mockInsights: Insight[] = [
  {
    id: 'sst-above-baseline',
    title: 'Sea surface temperature is trending above its 30-day average',
    summary:
      'Sample buoy readings across the monitored Atlantic stations are running 0.4 °C above their own recent baseline.',
    kind: 'measured',
    region: 'North Atlantic',
    dataset: 'NOAA NDBC',
    observedAt: '2026-10-26T14:37:00Z',
  },
]