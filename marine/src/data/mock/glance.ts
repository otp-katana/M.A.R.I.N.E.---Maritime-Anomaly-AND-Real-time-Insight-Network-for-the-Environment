import type { GlanceMetric, RangeDays } from '@/data/types'

function build(deltas: [number, number, number]): GlanceMetric[] {
  return [
    {
      id: 'heat-content',
      label: 'Ocean Heat Content',
      icon: 'waves',
      tone: 'cyan',
      value: 397,
      unit: 'ZJ',
      decimals: 0,
      deltaPct: deltas[0],
      sentiment: 'bad',
      cadence: 'monthly',
    },
    {
      id: 'chlorophyll',
      label: 'Chlorophyll-a',
      icon: 'leaf',
      tone: 'green',
      value: 0.35,
      unit: 'mg/m³',
      decimals: 2,
      deltaPct: deltas[1],
      sentiment: 'neutral',
      cadence: 'daily',
    },
    {
      id: 'sst',
      label: 'Sea Surface Temp.',
      icon: 'thermometer',
      tone: 'orange',
      value: 21.4,
      unit: '°C',
      decimals: 1,
      deltaPct: deltas[2],
      sentiment: 'good',
      cadence: 'daily',
    },
  ]
}

export const mockGlance: Record<RangeDays, GlanceMetric[]> = {
  7: build([0.3, 1.2, -0.1]),
  30: build([2.1, 4.8, -0.2]),
  90: build([4.6, 9.1, -0.5]),
}