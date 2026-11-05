import type { OceanLayer } from '@/data/types'

export const mockLayers: OceanLayer[] = [
  { id: 'surface', name: 'Surface', depth: '0 – 200 m', tone: 'cyan' },
  { id: 'thermocline', name: 'Thermocline', depth: '200 – 1000 m', tone: 'violet' },
  { id: 'deep', name: 'Deep Ocean', depth: '> 1000 m', tone: 'orange' },
]